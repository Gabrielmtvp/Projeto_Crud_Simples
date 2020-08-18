import React, { Component } from 'react';

export default class InputSubmit extends Component{

    render(){
        return(
            <div className="pure-control-group">                                  
                <label>{this.props.label}</label> 
                <button type={this.props.type} className="pure-button pure-button-primary">{this.props.descricao}</button>                                    
            </div>
        );
    }

}