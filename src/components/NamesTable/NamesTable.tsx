import { FC } from 'react';

interface IUser {
  id: string;
  name: string;
}

interface NamesTableProps {
  users: IUser[];
  currentUser: string | null;
  onSelectUser: (id: string) => void;
  disabled: boolean;
}

const NamesTable: FC<NamesTableProps> = (props) => {
  const { users, disabled, currentUser, onSelectUser } = props;

  if (users.length === 0) return <></>;

  const getClassName = (id: string) => {
    return `${currentUser === id ? 'active' : ''} ${
      disabled ? 'disabled' : ''
    }`;
  };

  return (
    <ul className="names">
      {users.map(({ name, id }) => (
        <li key={id}>
          <p
            className={getClassName(id)}
            onClick={() => !disabled && onSelectUser(id)}
          >
            {name}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default NamesTable;
