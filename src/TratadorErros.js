import PubSub from 'pubsub-js';

export default class TratadorErros {

    PublicaErros(erros){
        for(var i=0;i<erros.errors.length;i++){
            var erro = erros.errors[i];
            console.log(erro);
            PubSub.publish('erro-validacao', erro);
        }
    }
}