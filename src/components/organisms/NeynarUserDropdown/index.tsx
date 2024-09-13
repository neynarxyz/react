import React, { useState, useEffect, useRef } from 'react';
import { NEYNAR_API_URL } from '../../../constants';
import customFetch from '../../../utils/fetcher';
import { useNeynarContext } from '../../../contexts';

interface User {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
}

export interface NeynarUserDropdownProps {
    value?: string;
    onChange?: (value: string) => void;
    style?: React.CSSProperties;
    placeholder?: string;
    disabled?: boolean;
    viewerFid?: number;
}

async function fetchUsersByQuery({
  q,
  viewerFid,
  client_id
}: {
  q: string;
  viewerFid?: number;
  client_id: string;
}): Promise<User[] | null> {
  try {
    let requestUrl = `${NEYNAR_API_URL}/v2/farcaster/user/search?q=${q}&limit=5${viewerFid ? `&viewer_fid=${viewerFid}` : ''}&client_id=${client_id}`;
    const response = await customFetch(requestUrl);
    const data = await response.json();
    return data?.result?.users || [];
  } catch (error) {
    console.log("Error fetching users by query", error);
    return null;
  }
}

export const NeynarUserDropdown: React.FC<NeynarUserDropdownProps> = ({
 value: propValue,
 onChange,
  style = {},
  placeholder = 'Enter FIDs or usernames',
  disabled = false,
  viewerFid
}) => {
    const { client_id } = useNeynarContext();
    const [internalValue, setInternalValue] = useState(propValue || '');
    const [currentValue, setCurrentValue] = useState<string>('');
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [users, setUsers] = useState<User[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
  
    useEffect(() => {
      if (propValue !== undefined) {
        setInternalValue(propValue);
      }
    }, [propValue]);

    useEffect(() => {
      const values = internalValue.split(',');
      if (!values[values.length -1]) {
       setCurrentValue('');
        return;
      }
      setCurrentValue(values[values.length - 1].trim());
    }, [internalValue]);
  
    useEffect(() => {
        const shouldFetchUsers = currentValue !== '' && !/^\d+$/.test(currentValue);
        if (shouldFetchUsers) {
          fetchUsers(currentValue);
        } else {
          setShowDropdown(false);
        }
      }, [currentValue]);
    
    const fetchUsers = async (query: string) => {
      const fetchedUsers = await fetchUsersByQuery({ q: query, viewerFid, client_id });
      if (fetchedUsers) {
        setUsers(fetchedUsers);
        setShowDropdown(true);
      }
    };
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInternalValue(newValue);
      onChange && onChange(newValue);
    };
  
    const handleUserSelect = (user: User) => {
      let values = internalValue.split(',');
      values[values.length - 1] = user.fid.toString();
      const newValue = values.join(',');
      setInternalValue(newValue);
      onChange && onChange(newValue);
      setCurrentValue('');
      setShowDropdown(false);
    };
  
    const handleInputFocus = () => {
      if (currentValue && isNaN(Number(currentValue))) {
        setShowDropdown(true);
      }
    };
  
    const handleInputBlur = () => {
      setTimeout(() => setShowDropdown(false), 200);
    };
  
    return (
      <div style={{ position: 'relative', ...style }}>
        <input
          ref={inputRef}
          type="text"
          value={internalValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          disabled={disabled}
          style={{ width: '100%', padding: '8px' }}
        />
        {showDropdown && (
          <ul style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            maxHeight: '200px',
            overflowY: 'auto',
            border: '1px solid #ccc',
            borderTop: 'none',
            listStyle: 'none',
            padding: 0,
            margin: 0,
            backgroundColor: 'white',
            zIndex: 1000
          }}>
            {users.map((user) => (
              <li
                key={user.fid}
                onClick={() => handleUserSelect(user)}
                style={{
                  padding: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <img
                  src={user.pfp_url}
                  alt={user.username}
                  style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }}
                />
                <div>
                  <div>{user.display_name}</div>
                  <div style={{ fontSize: '0.8em', color: '#666' }}>@{user.username}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

export default NeynarUserDropdown;