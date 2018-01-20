import React, { Component } from 'react';
import { Switch, Redirect, Link } from 'react-router-dom';
import User from '../comps/User.js';
import axios from 'axios';
import SearchForm from '../comps/SearchForm.js';
import hostName from '../config.js';

require('./Common.css');
require('./Search.css');
class Search extends Component {
  constructor(props) {
    super(props);
    this.loadedComp = this.loadedComp.bind(this);
    this.loadingComp = this.loadingComp.bind(this);
    this.errorComp = this.errorComp.bind(this);
    this.addUser = this.addUser.bind(this);
    this.state = {currComp: this.loadingComp, users:[]};
    this.notFoundComp = this.notFoundComp.bind(this);
    var user = '';
    if('user' in this.props.match.params) user = this.props.match.params.user;
      axios
      .get(hostName+'query_user.php', {
        params: {
          user: user
      }
      })
      .then(response => {
       if(response.data.length>0)
        this.setState({users :  response.data, currComp:this.loadedComp});
      else
        this.setState({currComp:this.noDataComp});
      })
      .catch(error => {
         this.setState({currComp: this.errorComp});

      });

  }
  componentDidMount() { 
  this._ismounted = true;
}

componentWillUnmount() {
   this._ismounted = false;
}
  componentWillReceiveProps(nextprops){
    var user = '';
    if('user' in nextprops.match.params) user = nextprops.match.params.user;
      axios
      .get(hostName+'query_user.php', {
        params: {
          user: user
      }
      })
      .then(response => {
        if(this._ismounted){
         if(response.data.length>0)
          this.setState({users :  response.data, currComp:this.loadedComp});
         else
          this.setState({currComp:this.noDataComp});
        }
      })
      .catch(error => {
         if(this._ismounted)
          this.setState({currComp: this.errorComp});

      });
  }
  noDataComp(){
    return(<div className='messagebox'>
         <span className='messagebox-span'>Совпадений не найдено</span>
         </div>);
  }
  notFoundComp(){
    return(<div className='messagebox'>
         <span className='messagebox-span'>Пользователь {this.props.match.params.user} на lastfm не найден</span>
         </div>);
  }
  loadedComp(){
    return(<div className='users-grid'>
          {this.state.users.map((user) => 
          						<div key={user.username} username={user.username} className='users-grid-element'>
          					   	<User user={{name:user.username, url:user.image}} showDownloadLink={true} showStatLink = {true}/>
          						</div>)}
         </div>);
  }
  loadingComp(){
    return(<div  className='messagebox'>
          <span  className='messagebox-span'>Идет загрузка</span>
    </div>);
  }
  errorComp(){
    return(<div className='messagebox'>
          <span className='messagebox-span'>Проблемы с соединением</span>
     </div>);
  }

  addUser(){
      axios
      .get(hostName+'download_user.php', {
        params: {
          user: this.props.match.params.user
      }
      })
      .then(response => {
        if(this._ismounted)
        {
           if(typeof(response.data.username)!=='undefined'){
          var resp = [];
          resp.push(response.data);
          this.setState({users :  resp, currComp:this.loadedComp});
        }
         
        
       else
         this.setState({currComp:this.notFoundComp});
        }
      })
      .catch(error => {
        if(this._ismounted)
         this.setState({currComp: this.errorComp});

      });
  }
  
  render() {
    return (
     <div>
      <SearchForm/>
      <div className='content'>
         {this.state.currComp()}
      </div>
     <div className='search-add-user'>
      {this.props.match.params.hasOwnProperty('user')?<button onClick = {this.addUser}  className='add-user-button'>
        Добавить пользователя {this.props.match.params.user}
      </button>:null}
      </div>
      </div>
      )
    ;
  }

}


export default Search;
