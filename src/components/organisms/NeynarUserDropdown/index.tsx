import React, { useState, useEffect, useRef } from 'react';
import { styled } from '@pigment-css/react';
import { NEYNAR_API_URL } from '../../../constants';
import customFetch from '../../../utils/fetcher';
import { useNeynarContext } from '../../../contexts';
import UserDropdown from '../../molecules/UserDropdown';

interface User {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
}

export interface NeynarUserDropdownProps {
  value: string;
  onChange: (value: string) => void;
  style?: React.CSSProperties;
  placeholder?: string;
  disabled?: boolean;
  viewerFid?: number;
  customStyles?: {
    dropdown?: React.CSSProperties;
    listItem?: React.CSSProperties;
    avatar?: React.CSSProperties;
    userInfo?: React.CSSProperties;
  };
  limit?: number | null; // Number of users that can be selected, or null for no limit
}

const Container = styled.div(() => ({
  position: 'relative',
}));

const Input = styled.input(() => ({
  width: '100%',
  padding: '8px',
}));

async function fetchUsersByQuery({
  q,
  viewerFid,
  client_id,
}: {
  q: string;
  viewerFid?: number;
  client_id: string;
}): Promise<User[] | null> {
  try {
    let requestUrl = `${NEYNAR_API_URL}/v2/farcaster/user/search?q=${q}&limit=5${
      viewerFid ? `&viewer_fid=${viewerFid}` : ''
    }&client_id=${client_id}`;
    const response = await customFetch(requestUrl);
    const data = await response.json();
    return data?.result?.users || [];
  } catch (error) {
    console.log('Error fetching users by query', error);
    return null;
  }
}

export const NeynarUserDropdown: React.FC<NeynarUserDropdownProps> = ({
  value,
  onChange,
  style = {},
  placeholder = 'Enter FIDs or usernames',
  disabled = false,
  viewerFid,
  customStyles = {},
  limit = null,
}) => {
  const { client_id } = useNeynarContext();
  const [currentValue, setCurrentValue] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const values = value?.split(',') || [];
    if (!values[values.length - 1]) {
      setCurrentValue('');
      return;
    }
    setCurrentValue(values[values.length - 1].trim());
  }, [value]);

  useEffect(() => {
    const shouldFetchUsers = currentValue !== '' && !/^\d+$/.test(currentValue);
    if (shouldFetchUsers) {
      fetchUsers(currentValue);
    } else {
      setShowDropdown(false);
    }
  }, [currentValue]);

  const fetchUsers = async (query: string) => {
    const fetchedUsers = await fetchUsersByQuery({
      q: query,
      viewerFid,
      client_id,
    });
    if (fetchedUsers) {
      setUsers(fetchedUsers);
      setShowDropdown(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  const handleUserSelect = (user: User) => {
    let values = value.split(',');

    if (limit !== null && values.length >= limit) {
      values[values.length - 1] = user.fid.toString();
    } else {
      values.push(user.fid.toString());
    }

    const newValue = values.join(',');
    onChange(newValue);
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
    <Container style={style}>
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        disabled={disabled}
      />
      {showDropdown && (
        <UserDropdown
          users={users}
          onSelect={handleUserSelect}
          customStyles={customStyles}
        />
      )}
    </Container>
  );
};

export default NeynarUserDropdown;
