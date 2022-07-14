import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";

import styles from "./App.module.css";
import { GET_ALL_USERS, GET_ONE_USER } from "./query/user";
import { CREATE_USER, REMOVE_USER } from "./mutation/user";
const App = () => {
  const { data, loading, refetch, error } = useQuery(GET_ALL_USERS);
  const { data: oneUser, loading: loadingOneUser } = useQuery(GET_ONE_USER);

  const [newUser] = useMutation(CREATE_USER);
  const [removeUser] = useMutation(REMOVE_USER);

  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");

  useEffect(() => {
    if (!loading) {
      setUsers(data.getAllUsers);
    }
  }, [data, loading]);

  const addUser = (e) => {
    e.preventDefault();
    if (username && age) {
      newUser({
        variables: {
          input: {
            username,
            age: +age,
          },
        },
      }).finally(() => {
        refetch();
        setUsername("");
        setAge("");
      });
    }
  };

  const getAllUsers = (e) => {
    e.preventDefault();

    refetch();
  };

  const onRemoveUser = (e, userId) => {
    e.preventDefault();
    removeUser({
      variables: {
        id: userId,
      },
    }).finally(() => {
      refetch();
    });
  };

  if (loading) {
    return <h1>...Loading</h1>;
  }

  return (
    <div className={styles.App}>
      <form>
        <label>
          User name
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          User age
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </label>
        <div>
          <button onClick={addUser}>Create User</button>
          <button onClick={getAllUsers}>Get Users</button>
        </div>
      </form>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.id}
            <h3>{user.username}</h3>
            <h4>{user.age}</h4>
            <button onClick={(e) => onRemoveUser(e, user.id)}>
              Remove User
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
