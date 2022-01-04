# Controle de Estoque e de Clientes

### O sistema

A primeira parte do sistema se baseia em um problema que uma loja de consertos eletrônicos, onde o dono consegue organizar as diversas peças/componentes que são utilizados nesses consertos, mas depois tem dificuldade para localizar cada um dos componentes. Dentre as funcionalidades:
- Cadastro de determinado componente (nome, descrição, localização, quantidade); 
- Consulta simples  com base no nome e na localização para saber onde determinado componente se localiza dentro da loja/armazem.

A segunda parte desse sistema tem a ideia de ser um histórico de clientes:
- Possibilidade de se cadastrar um clientes com suas informações, como o eletrônico defeituoso, o custo do conserto, as formas de contato desse cliente;
- Posterior consulta de um determinado cliente e suas informações;

Sobre as tecnologias, foi usado o ElectronJS para criar as interfaces do usuário + o Firebase para armazenar os dados na nuvem.

### Para rodar a aplicação

Além de ter todas as dependências instaladas, para rodar a aplicação, é necessário criar uma pasta na raiz do projeto `./config/firebase.js` junto com um arquivo `firebase.js`. Nesse arquivo você pode importar o Firebase e fazer a configuração básica como diz na [Documentação do Firebase](https://firebase.google.com/docs/web/setup#add-sdks-initialize). Após isso, você pode dar um `export {...}` nas funções e valores que serão utilizados nos `.js` da aplicação. Nesse caso, `export { getDocs, setDoc, addDoc, collection, deleteDoc, doc }` (todos importados do firebase). Esse arquivo será importado no `./src/js/componentsControl.js` e `./src/js/clientsControl.js`;
