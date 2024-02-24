import React from 'react';
import { User } from './UserData';

type UserListProps = {
  users: User[];
  currentTab: string;
  handleSort: (criteria: 'studyMinutes' | 'score' | 'experienceDays') => void;
  getPossible: (user: User) => string;
};

const UserList: React.FC<UserListProps> = ({
  users,
  currentTab,
  handleSort,
  getPossible,
}) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Email</th>
            <th>Age</th>
            <th>Post Code</th>
            <th>Phone</th>
            <th>Hobbies</th>
            <th>URL</th>
            {(currentTab === 'student' || currentTab === 'all') && (
              <>
                <th>
                  Study Minutes{' '}
                  <button
                    className="btn-sort"
                    onClick={() => handleSort('studyMinutes')}
                  >
                    ⇅
                  </button>
                </th>
                <th>Task Code</th>
                <th>Study Langs</th>
                <th>
                  Score{' '}
                  <button
                    className="btn-sort"
                    onClick={() => handleSort('score')}
                  >
                    ⇅
                  </button>
                </th>
                <th>Possible Mentors</th>
              </>
            )}
            {(currentTab === 'mentor' || currentTab === 'all') && (
              <>
                <th>
                  Experience Days{' '}
                  <button
                    className="btn-sort"
                    onClick={() => handleSort('experienceDays')}
                  >
                    ⇅
                  </button>
                </th>
                <th>Use Langs</th>
                <th>Available Start Code</th>
                <th>Available End Code</th>
                <th>Possible Students</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.role}</td>
              <td>{u.email}</td>
              <td>{u.age}</td>
              <td>{u.postCode}</td>
              <td>{u.phone}</td>
              <td>{u.hobbies.join(', ')}</td>
              <td>
                <a href={u.url} target="_blank" rel="noopener noreferrer">
                  Link
                </a>
              </td>
              {(u.role === 'student' || currentTab === 'all') && (
                <>
                  <td>{u.studyMinutes}</td>
                  <td>{u.taskCode}</td>
                  <td>{u.studyLangs ? u.studyLangs.join(', ') : ''}</td>
                  <td>{u.score}</td>
                  <td>{getPossible(u as User)}</td>
                </>
              )}
              {(u.role === 'mentor' || currentTab === 'all') && (
                <>
                  <td>{u.experienceDays}</td>
                  <td>{u.useLangs ? u.useLangs.join(', ') : ''}</td>
                  <td>{u.availableStartCode}</td>
                  <td>{u.availableEndCode}</td>
                  <td>{getPossible(u as User)}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
