import React, { Component } from 'react';
import PubSub from 'pubsub-js';

export default class SelectCustomizado extends Component{
    
    constructor(){
        super();
        this.state = {msgErro:''};
    }

    componentDidMount(){
        PubSub.subscribe("erro-validacao", function(topico, erro){
            if(erro.field === this.props.name)
            this.setState({msgErro:erro});
        }.bind(this));

        PubSub.subscribe('limpa-erros', function(topico){
            this.setState({msgErro:''});
        }.bind(this));
    }

    render(){
        return(
            <div className="pure-control-group">
                <label>Autores</label>
                <select value={this.props.value } name={this.props.name} onChange={ this.props.onChange }>
                    <option value="">Selecione</option>
                    { 
                        this.props.listaAutores.map(function(autor) {
                        return <option key={ autor.id } value={ autor.id }>
                                    { autor.nome }
                                </option>;
                        })
                    }
                </select>
                <span>{this.state.msgErro}</span>
            </div>
        );
    }
}