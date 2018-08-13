import React from 'react';
import ReactDOM from 'react-dom';

export default class PlayersList extends React.Component {
    constructor(args) {
        super(...args);
        this.state = {
			content : []
        }
		this.getPlayerListContent = this.getPlayerListContent.bind(this);
		
	}
	componentDidMount() {
		this.getPlayerListContent();
    }
    componentWillUnmount() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }

	getPlayerListContent(){
		return fetch('/users/allUsers', {method: 'GET', credentials: 'include'})
		.then((response) => {
			if (!response.ok){
				throw response;
			}
			this.timeoutId = setTimeout(this.getPlayerListContent, 200);
			return response.json();            
		})
		.then(content => {
			this.setState(()=>({content}));
		})
		.catch(err => {throw err});
    }

	render(){
			return(
				<div id="playersList" className="list-type3">
					<ol>
						{
							this.state.content.map((user, index) =>( <li key={user.name+'_' + index}><a> {user.name}</a></li>))
						}
					</ol>
				</div>
			);
	}
}