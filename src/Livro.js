import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import InputSubmit from './componentes/InputSubmit';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';
import SelectCustomizado from './componentes/SelectCustomizado';

class FormularioLivro extends Component{

    constructor(){
        //Criado estados
        super();
        this.state = {titulo:'', preco: '', autorId: ''};

        //Seta o bind do react nas funções Set's
        this.enviaLivro = this.enviaLivro.bind(this);
    }

    salvaAlteracao(inputNome, evento){
      this.setState({[inputNome]: evento.target.value});
    }

    enviaLivro(evento){
        evento.preventDefault();
        console.log("Enviando dados");

        $.ajax({
            url: 'https://cdc-react.herokuapp.com/api/livros',
            contentType: 'application/json',
            dataType:'json',
            type:'post',
            data: JSON.stringify({titulo:this.state.titulo, preco:this.state.preco, autorId:this.state.autorId}),
            success: function(novaLista){
                PubSub.publish("atualiza-lista-livros", novaLista);
                this.setState({titulo: '', preco: '', autorId: ''});
            }.bind(this),
            error: function(resposta){
                console.log("error " + resposta);
                new TratadorErros().PublicaErros(resposta.responseJSON);
            },
            beforeSend: function(){
                PubSub.publish("limpa-erros", {});
            }
        })
    }

    render(){
        return(
            <div>
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaLivro} method="post" >
                    <InputCustomizado type="text" name="titulo" id="titulo" value={this.state.titulo} onChange={this.salvaAlteracao.bind(this, "titulo")} label="Título" />
                    <InputCustomizado type="text" name="preco" id="preco" value={this.state.preco} onChange={this.salvaAlteracao.bind(this, "preco")} label="Preço" />
                    <SelectCustomizado name="autorId" value={this.state.autorId} onChange={this.salvaAlteracao.bind(this, "autorId")} listaAutores={this.props.listaAutores} />
                    <InputSubmit type="submit" descricao="Gravar" label="" />
                </form>
            </div>
        );
    }
}

class TabelaLivro extends Component{
    render(){
        return(
            <div>            
            <table className="pure-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Preço</th>
                  <th>Autor</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.props.lista.map(function(livro){
                    return(
                      <tr key={livro.id}>
                        <td>{livro.titulo}</td>
                        <td>{livro.preco}</td>
                        <td>{livro.autor.nome}</td>
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

export default class LivroBox extends Component{
    constructor(){
        super();
        this.state = {lista : [], listaAutores: []};
    }
    
    componentDidMount(){
        $.ajax({    
          url:' https://cdc-react.herokuapp.com/api/livros',
          dataType:'json',
          success:function(resposta){
            this.setState({lista:resposta})
          }.bind(this)
        })

        $.ajax({    
            url:'https://cdc-react.herokuapp.com/api/autores',
            dataType:'json',
            success:function(resposta){
              this.setState({listaAutores:resposta})
            }.bind(this)
          })

        PubSub.subscribe('atualiza-lista-livros', function(topico, novaLista){
            this.setState({lista:novaLista})
        }.bind(this));
    }

    render(){
        return(
            <div>
                <div className="header">
                    <h1>Cadastro de Livros</h1>
                </div>
                <div className="content" id="content">
                    <FormularioLivro listaAutores={this.state.listaAutores} />
                    <TabelaLivro lista={this.state.lista} />
                </div>
            </div>
        );
    }
}