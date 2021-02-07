import React, { Component } from 'react';
import Header from '../components/resty/Header';
import Form from '../components/resty/Form';
import { fetchApi } from '../services/fetchApi';
import Display from '../components/resty/Display';
import HistoryList from '../components/resty/HistoryList';
import styles from './RestyBox.css';


export default class RestyBox extends Component {
    state ={
      url: '',
      method: '',
      body: '',
      history: [],
      display: { 'Howdy!':'Go get something for me, will ya?' }
    }

    componentDidMount(){
      const storeHistory = JSON.parse(localStorage.getItem('history'));

      if(storeHistory){
        this.setState({ history: storeHistory });
      }
    }

    handleChange = ({ target }) => {
      this.setState({ [target.name]: target.value });
    }

    handleSubmit = event => {
      const { url, method, history } = this.state;
      const key = `${url}+${method}`;

      event.preventDefault();
      this.fetch();

      if(history.filter
      (item => item.key === key).length > 0 || method === '') return;
      this.setState(state => ({
        history: [...state.history, {
          url: state.url, 
          method: state.method,  
          body: state.body,
          key: `${state.url}+${state.method}`
        }]
      }));

      this.setState(state => {
        localStorage.setItem('history', JSON.stringify(state.history));
      });
    }

    handleClick = event => {
      const { id } = event.target;
      let result;

      this.state.history.forEach(item => {
        if(item.key === id){
          result = item;
        }
      });

      this.setState({
        url: result.url, 
        method: result.method,
        body: result.body
      });
    }

    //to run test

    fetch = () => {
      const { url, method, body } = this.state;
      return fetchApi(url, method, body)
        .then(res => this.setState({ display: res }));
    }
    render() {
      const { url, method, body, history, display } = this.state;

      return (

        <>
          <Header/>
          <div className={styles.RestyBox}>
            <HistoryList history={history} onClick={this.handleClick} />
            <section>
              <Form
                url={url}
                method={method}
                body={body}
                onSubmit={this.handleSubmit}
                onChange={this.handleChange} />
              <Display display={display} />

            </section>
                
          </div>
        </>
      );
    }
}

