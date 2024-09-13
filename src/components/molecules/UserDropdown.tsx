import React from 'react';
import { styled } from '@pigment-css/react';

interface User {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
}

interface UserDropdownProps {
  users: User[];
  onSelect: (user: User) => void;
  customStyles?: {
    dropdown?: React.CSSProperties;
    listItem?: React.CSSProperties;
    avatar?: React.CSSProperties;
    userInfo?: React.CSSProperties;
  };
}


const DropdownList = styled.ul(() => ({
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
  zIndex: 1000,
}));

const ListItem = styled.li(() => ({
  padding: '8px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: '#f0f0f0',
  },
}));

const Avatar = styled.img(() => ({
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  marginRight: '10px',
}));

const UserInfo = styled.div(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

const DisplayName = styled.div(() => ({
  fontWeight: 'bold',
}));

const Username = styled.div(() => ({
  fontSize: '0.8em',
  color: '#666',
}));

const UserDropdown: React.FC<UserDropdownProps> = ({
  users,
  onSelect,
  customStyles = {}
}) => {
  return (
    <DropdownList style={{ ...customStyles?.dropdown }}>
      {users.map((user) => (
        <ListItem style={{...customStyles?.listItem}} key={user.fid} onClick={() => onSelect(user)}>
          <Avatar style={{...customStyles?.avatar}} src={user.pfp_url} alt={user.username} />
          <UserInfo style={{...customStyles.userInfo}}>
            <DisplayName>{user.display_name}</DisplayName>
            <Username>@{user.username}</Username>
          </UserInfo>
        </ListItem>
      ))}
    </DropdownList>
  );
};

export default UserDropdown;