import { useState } from 'react';
import './App.css';
import { User, USER_LIST } from './components/UserData';
import UserForm from './components/UserForm';
import UserList from './components/UserList';

type SortRule = 'studyMinutes' | 'score' | 'experienceDays' | null;
type SortOrder = 'asc' | 'desc' | null;

function App() {
  const users = ['all', 'student', 'mentor'];
  const registUsers = ['student', 'mentor'];
  const [userList, setUserList] = useState<User[]>(USER_LIST);
  const [newUser, setNewUser] = useState<User>({
    id: userList.length + 1, // 新しいユーザーに一意のIDを割り当てる
    name: '',
    role: 'student', // デフォルト値を'student'に設定
    email: '',
    age: 0,
    postCode: '',
    phone: '',
    hobbies: [],
    url: '',
    studyMinutes: null,
    taskCode: null,
    studyLangs: null,
    score: null,
    experienceDays: null,
    useLangs: null,
    availableStartCode: null,
    availableEndCode: null,
  });
  const [form, setForm] = useState(false);
  const [registTab, setRegistTab] = useState('student'); //  新規登録フォームの表示対象を設定
  const [currentTab, setCurrentTab] = useState(users[0]); // テーブルの表示対象を設定
  const [sortRule, setSortRule] = useState<SortRule>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  // ユーザー追加関数
  const addUser = () => {
    const newId =
      userList.reduce((maxId, user) => Math.max(user.id, maxId), 0) + 1;
    const updatedUser = { ...newUser, id: newId };
    setUserList([...userList, updatedUser]);

    // フォームのリセット
    setNewUser({
      id: 0, // idは自動生成されるため、初期値は0または省略可能
      name: '',
      role: 'student', // デフォルト値
      email: '',
      age: null,
      postCode: '',
      phone: '',
      hobbies: [],
      url: '',
      studyMinutes: undefined,
      taskCode: undefined,
      studyLangs: [],
      score: undefined,
      experienceDays: undefined,
      useLangs: [],
      availableStartCode: undefined,
      availableEndCode: undefined,
    });
    alert('ユーザーを追加しました');
    setForm(false); // フォームを非表示にする
  };

  const handleSort = (criteria: SortRule) => {
    // ソートルールと順序を設定する
    setSortRule(criteria);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // 順序の切り替え 昇順('asc') / 降順('desc')
  };

  const sortedUserList = userList
    .filter((user) => currentTab === 'all' || user.role === currentTab)
    .sort((a, b) => {
      // ソート関数

      // ソートルールまたは順序が未設定の場合は、配列の順序を変更なし
      if (!sortRule || sortOrder === null) return 0;

      // ソートルールに従って各ユーザーの値を取得する 値が未定義の場合は -Infinity を使用
      let valueA = a[sortRule] ?? -Infinity;
      let valueB = b[sortRule] ?? -Infinity;

      if (sortOrder === 'asc') {
        // 昇順の場合は valueA が valueB より大きければ 1（a を b の後に）を返す
        return valueA > valueB ? 1 : -1;
      } else {
        // それ以外は -1（b を a の後に）を返す
        return valueA < valueB ? 1 : -1;
      }
    });

  const getPossible = (user: User) => {
    // 対応可能なメンターや生徒を取得する関数
    if (user.role === 'student') {
      // 生徒の場合、課題番号に対応可能なメンターを取得する
      const possibleMentors = USER_LIST.filter(
        (mentor) =>
          mentor.role === 'mentor' &&
          mentor.availableStartCode &&
          mentor.availableEndCode &&
          user.taskCode &&
          user.taskCode >= mentor.availableStartCode &&
          user.taskCode <= mentor.availableEndCode
      ).map((mentor) => mentor.name);
      return possibleMentors.length > 0 ? possibleMentors.join(', ') : '-';
    } else if (user.role === 'mentor') {
      // メンターの場合、その担当範囲内の課題番号を持つ生徒を取得する
      const possibleStudents = USER_LIST.filter(
        (student) =>
          student.role === 'student' &&
          user.availableStartCode &&
          user.availableEndCode &&
          student.taskCode &&
          student.taskCode >= user.availableStartCode &&
          student.taskCode <= user.availableEndCode
      ).map((student) => student.name);
      return possibleStudents.length > 0 ? possibleStudents.join(', ') : '-';
    }
    return '-';
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          {users.map((user) =>
            user === currentTab ? (
              <button
                key={user}
                style={{ background: 'rgb(63, 117, 165)' }}
                className="btn-role"
                onClick={() => setCurrentTab(user)}
              >
                {user}
              </button>
            ) : (
              <button
                key={user}
                className="btn-role"
                onClick={() => setCurrentTab(user)}
              >
                {user}
              </button>
            )
          )}
        </div>

        {/* 新規登録フォーム */}
        <div>
          <button className="btn-signup" onClick={() => setForm(!form)}>
            ＜＜＜ Sign Up User ＞＞＞
          </button>

          {/* フォーム入力フィールド */}
          {form && (
            <UserForm
              newUser={newUser}
              setNewUser={setNewUser}
              addUser={addUser}
              registUsers={registUsers}
              setRegistTab={setRegistTab}
              registTab={registTab}
            />
          )}
        </div>

        <div>
          <h2>＜ {currentTab} ＞</h2>
          <UserList
            users={sortedUserList}
            currentTab={currentTab}
            handleSort={handleSort}
            getPossible={getPossible}
          />
        </div>
      </header>
    </div>
  );
}

export default App;
