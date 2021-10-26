import './App.css';
import Amplify ,{API, graphqlOperation }from 'aws-amplify';
import awsconfig from './aws-exports';
import{AmplifySignOut,withAuthenticator} from '@aws-amplify/ui-react'
import {listUsers} from './graphql/queries';
import {useState} from 'react';
import {useEffect} from 'react';
Amplify.configure(awsconfig);

function App() {

  const [users,setUsers] = useState([]);
  useEffect(() => {
    fetchUsers()
  },[])
  const fetchUsers = async () => {
    
    try{
      const userData = await API.graphql(graphqlOperation(listUsers))
      const userList = userData.data.listUsers.items;
      console.log('user list',userList);
      setUsers(userList)
    }catch(error){
    console.log('error on u kow', error);
  }
  };

    return (
      <div className="App">
        <header className="App-header">
          <AmplifySignOut/>
          <h2>My app content</h2>
        </header>
      </div>
    );
}


export default withAuthenticator(App);

