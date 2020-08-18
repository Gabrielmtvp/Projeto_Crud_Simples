import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import InputSubmit from './componentes/InputSubmit';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';

class FormularioAutor extends Component{

    constructor(){
        super();
        this.state = {nome : '', email : '', senha : ''};
    
        //define que o this do enviaForm será o this do react
        this.enviaForm = this.enviaForm.bind(this);
      }

    enviaForm(evento){
        evento.preventDefault();
        console.log("Enviando dados");
    
        $.ajax({
          url:'https://cdc-react.herokuapp.com/api/autores',
          contentType:'application/json',
          dataType:'json',
          type:'post',
          data:JSON.stringify({nome:this.state.nome,email:this.state.email,senha:this.state.senha}),
          success:function(novaLista){
            console.log("Enviado com sucesso " + novaLista);
            PubSub.publish('atualiza-lista-autores', novaLista);
            this.setState({nome:'', email:'', senha:''});
          }.bind(this),
          error: function(resposta){
            console.log("Erro " + resposta);
            new TratadorErros().PublicaErros(resposta.responseJSON);
          },
          beforeSend: function(){
              PubSub.publish("limpa-erros", {});
          }
        });
      }

      salvaAlteracao(inputNome, evento){
        this.setState({[inputNome]: evento.target.value});
      }

    render(){
        return(
            <div>
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post" >
                    <InputCustomizado id="nome" type="text" name="nome" value={this.state.nome} onChange={this.salvaAlteracao.bind(this, "nome")} label="Nome" />
                    <InputCustomizado id="email" type="email" name="email" value={this.state.email} onChange={this.salvaAlteracao.bind(this, "email")} label="Email" />
                    <InputCustomizado id="senha" type="password" name="senha" value={this.state.senha} onChange={this.salvaAlteracao.bind(this, "senha")} label="Senha" />
                    <InputSubmit type="submit" descricao="Gravar" label="" />
                </form>             
            </div>  
        );
    }
}

class TabelaAutor extends Component{

    render(){
        return(
            <div>            
            <table className="pure-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>email</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.props.lista.map(function(autor){
                    return(
                      <tr key={autor.id}>
                        <td>{autor.nome}</td>
                        <td>{autor.email}</td>
                      </tr>
                    )
                  })
                }  
              </tbody>
            </table> 
          </div>  
        );
    }
}

export default class AutorBox extends Component{
    constructor(){
        super();
        this.state = {lista : []};
    }
    
    componentDidMount(){
        $.ajax({    
          url:'https://cdc-react.herokuapp.com/api/autores',
          dataType:'json',
          success:function(resposta){
            this.setState({lista:resposta})
          }.bind(this)
        })

        PubSub.subscribe('atualiza-lista-autores', function(topico, novaLista){
            this.setState({lista:novaLista})
        }.bind(this));
    }

    render(){
        return(
            <div>
                <div className="header">
                    <h1>Cadastro de Autores</h1>
                </div>
                <div className="content" id="content">
                    <FormularioAutor />
                    <TabelaAutor lista={this.state.lista} />
                </div>
            </div>
        );
    }

}