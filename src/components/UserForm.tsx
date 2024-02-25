import React from 'react';
import { User } from './UserData';

type UserFormProps = {
  newUser: User;
  setNewUser: React.Dispatch<React.SetStateAction<User>>;
  addUser: () => void;
  registUsers: string[];
  setRegistTab: React.Dispatch<React.SetStateAction<string>>;
  registTab: string;
};

const UserForm: React.FC<UserFormProps> = ({
  newUser,
  setNewUser,
  addUser,
  registUsers,
  setRegistTab,
  registTab,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 全項目入力必須のバリデーション
    if (
      !newUser.name ||
      !newUser.email ||
      newUser.age === null ||
      !newUser.postCode ||
      !newUser.phone ||
      newUser.hobbies.length === 0 ||
      !newUser.url ||
      (registTab === 'student' &&
        (!newUser.studyMinutes ||
          !newUser.taskCode ||
          newUser.studyLangs?.length === 0 ||
          !newUser.score)) ||
      (registTab === 'mentor' &&
        (!newUser.experienceDays ||
          newUser.useLangs?.length === 0 ||
          !newUser.availableStartCode ||
          !newUser.availableEndCode))
    ) {
      alert('全項目入力必須です');
      return;
    }

    // 負の値のバリデーション
    if (
      newUser.age < 0 ||
      (newUser.studyMinutes ?? 0) < 0 ||
      (newUser.taskCode ?? 0) < 0 ||
      (newUser.score ?? 0) < 0 ||
      (newUser.experienceDays ?? 0) < 0 ||
      (newUser.availableStartCode ?? 0) < 0 ||
      (newUser.availableEndCode ?? 0) < 0
    ) {
      alert('0以上の値を入力してください');
      return;
    }

    // 郵便番号のバリデーション
    if (newUser.postCode.match(/^\d{3}-\d{4}$/) === null) {
      alert('郵便番号はXXX-XXXXの形式で入力してください');
      return;
    }

    // 電話番号のバリデーション
    if (newUser.phone.match(/^\d{3}-\d{4}-\d{4}$/) === null) {
      alert('電話番号はXXX-XXXX-XXXXの形式で入力してください');
      return;
    }

    // メールアドレスのバリデーション
    if (
      newUser.email.match(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      ) === null
    ) {
      alert('メールアドレスの形式が違います');
      return;
    }

    // Available Start CodeとAvailable End Codeのバリデーション
    if (
      newUser.availableStartCode !== null &&
      newUser.availableStartCode !== undefined &&
      newUser.availableEndCode !== null &&
      newUser.availableEndCode !== undefined &&
      newUser.availableStartCode > newUser.availableEndCode
    ) {
      alert(
        'Available Start CodeはAvailable End Codeより小さい値を入力してください'
      );
      return;
    }

    addUser();
  };

  return (
    <div className="form-container">
      {/* ユーザ切り替え */}
      <div>
        {registUsers.map((user) =>
          user === registTab ? (
            <button
              key={user}
              style={{ background: 'rgb(106, 196, 67)' }}
              className="btn-role-reg"
              onClick={() => setRegistTab(user)}
            >
              {user}
            </button>
          ) : (
            <button
              key={user}
              className="btn-role-reg"
              onClick={() => setRegistTab(user)}
            >
              {user}
            </button>
          )
        )}
      </div>

      {/* 共通のフォーム入力 */}
      <form onSubmit={handleSubmit}>
        <div className="form-regist">
          <div className="child">
            <div className="g-child">
              <label>Name:</label>
              <input
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                placeholder="鈴木◯"
              />
            </div>
            <div className="g-child">
              <label>Role:</label>
              <select style={{ width: '147px' }}>
                {registUsers.map((user, index) => (
                  <option key={index} value={user}>
                    {user}
                  </option>
                ))}
              </select>
            </div>
            <div className="g-child">
              <label>Email:</label>
              <input
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                placeholder="email@test.com"
              />
            </div>
            <div className="g-child">
              <label>Age:</label>
              <input
                value={newUser.age !== null ? newUser.age.toString() : ''}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    age:
                      e.target.value !== ''
                        ? parseInt(e.target.value, 10)
                        : null,
                  })
                }
                placeholder="28"
              />
            </div>
            <div className="g-child">
              <label>Post Code:</label>
              <input
                value={newUser.postCode}
                onChange={(e) =>
                  setNewUser({ ...newUser, postCode: e.target.value })
                }
                placeholder="123-4567"
              />
            </div>
            <div className="g-child">
              <label>Phone:</label>
              <input
                value={newUser.phone}
                onChange={(e) =>
                  setNewUser({ ...newUser, phone: e.target.value })
                }
                placeholder="080-1234-5678"
              />
            </div>
            <div className="g-child">
              <label>Hobbies:</label>
              <input
                value={newUser.hobbies.join(', ')}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    hobbies: e.target.value
                      .split(',')
                      .map((hobby) => hobby.trim()),
                  })
                }
                placeholder="Hobbie1,Hobbie2,..."
              />
            </div>
            <div className="g-child">
              <label>URL:</label>
              <input
                value={newUser.url}
                onChange={(e) =>
                  setNewUser({ ...newUser, url: e.target.value })
                }
                placeholder="https://test.com"
              />
            </div>
          </div>

          {/* student用のフォーム入力 */}
          {registTab === 'student' && (
            <div className="child">
              <div className="g-child">
                <label>Study Minutes:</label>
                <input
                  value={
                    newUser.studyMinutes ? newUser.studyMinutes.toString() : ''
                  }
                  onChange={(e) => {
                    const value =
                      e.target.value === ''
                        ? null
                        : parseInt(e.target.value, 10);
                    setNewUser({ ...newUser, studyMinutes: value });
                  }}
                  placeholder="3000 (Minutes)"
                />
              </div>
              <div className="g-child">
                <label>Task Code:</label>
                <input
                  value={newUser.taskCode ? newUser.taskCode.toString() : ''}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      taskCode: e.target.value
                        ? parseInt(e.target.value, 10)
                        : null,
                    })
                  }
                  placeholder="100"
                />
              </div>
              <div className="g-child">
                <label>Study Langs:</label>
                <input
                  value={newUser.studyLangs?.join(', ') || ''}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      studyLangs: e.target.value
                        ? e.target.value.split(',').map((lang) => lang.trim())
                        : null,
                    })
                  }
                  placeholder="Python,Java,..."
                />
              </div>
              <div className="g-child">
                <label>Score:</label>
                <input
                  value={newUser.score ? newUser.score.toString() : ''}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      score: e.target.value
                        ? parseInt(e.target.value, 10)
                        : null,
                    })
                  }
                  placeholder="80"
                />
              </div>
            </div>
          )}

          {/* mentor用のフォーム入力 */}
          {registTab === 'mentor' && (
            <div className="child">
              <div className="g-child">
                <label>Experience Days:</label>
                <input
                  value={
                    newUser.experienceDays
                      ? newUser.experienceDays.toString()
                      : ''
                  }
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      experienceDays:
                        e.target.value === ''
                          ? null
                          : parseInt(e.target.value, 10),
                    })
                  }
                  placeholder="200"
                />
              </div>
              <div className="g-child">
                <label>Use Langs:</label>
                <input
                  value={newUser.useLangs?.join(', ') || ''}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      useLangs: e.target.value
                        ? e.target.value.split(',').map((lang) => lang.trim())
                        : [],
                    })
                  }
                  placeholder="Python,Java,..."
                />
              </div>
              <div className="g-child">
                <label>Available Start Code:</label>
                <input
                  value={
                    newUser.availableStartCode
                      ? newUser.availableStartCode.toString()
                      : ''
                  }
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      availableStartCode:
                        e.target.value === ''
                          ? null
                          : parseInt(e.target.value, 10),
                    })
                  }
                  placeholder="100"
                />
              </div>
              <div className="g-child">
                <label>Available End Code:</label>
                <input
                  value={
                    newUser.availableEndCode
                      ? newUser.availableEndCode.toString()
                      : ''
                  }
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      availableEndCode:
                        e.target.value === ''
                          ? null
                          : parseInt(e.target.value, 10),
                    })
                  }
                  placeholder="500"
                />
              </div>
            </div>
          )}
        </div>
        <button
          type="submit"
          className="btn-regist"
          style={{ background: 'rgb(106, 196, 67)' }}
        >
          Regist
        </button>
      </form>
    </div>
  );
};

export default UserForm;
