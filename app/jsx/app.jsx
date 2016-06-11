const scrollTopGap = 80;

const React = require('react'),
      render = require('react-dom').render;

// Components
const [
    Main, Colors, Icons, Components, Variables, Utilities, Modules
] = [
    require('./pages/main'),
    require('./pages/style/colors'),
    require('./pages/style/icons'),
    require('./pages/style/components'),
    require('./pages/scss/variables'),
    require('./pages/scss/utilities'),
    require('./pages/scss/modules')
];

// route 및 link 세팅
const routeConf = {
    menus: {
        style: {
            color:      '/style/colors',
            icon:       '/style/icons',
            components: '/style/components'
        },
        scss: {
            variables:  '/scss/variables',
            utilities:  '/scss/utilities',
            modules: {
                accordion:  '/scss/modules#accordion',
                alarm:      '/scss/modules#alarm',
                badge:      '/scss/modules#badge'
            }
        }
    },
    routes: {
        '/style/colors'     : Colors,
        '/style/icons'      : Icons,
        '/style/components' : Components,
        '/scss/variables'   : Variables,
        '/scss/utilities'   : Utilities,
        '/scss/modules'     : Modules
    }
};

const Header = React.createClass({
    render (){ 
        return (
            <div className="header">
                <h1 style={{color:'#fff'}}><a href="#">Simple Router for ReactJS<sub> by gomugom @16.06.12</sub></a></h1>
            </div>
        )
    }
});

const Nav = React.createClass({
    renderMenu(){
        let depth = 1;
        const getElem = obj => {
            let inner = [];
            depth++;
            for(let item in obj){
                if(obj[item] instanceof Object) {
                    inner.push(
                        <li className="dir" key={'dir_' + depth + '_' + item}>
                            <span>{item}</span>
                            <ul className={'nav nav__depth' + depth}>
                                {getElem(obj[item])}
                            </ul>
                        </li>
                    );
                } else {
                    inner.push(
                        <li className="file" key={'file_' + depth + '_' + item}>
                            <a href={'#' + obj[item]}>{item}</a>
                        </li>
                    );
                }
            }
            depth--;
            return inner;
        };
        return getElem(routeConf.menus);
    },
    render (){ 
        return (
            <div className="gnb">
                <ul className="nav nav__depth1">
                    {this.renderMenu()}
                </ul>
            </div>
        )
    }
});

const scrollToTarget = target => {
    target = document.getElementById(target);
    window.scrollTo(0, target ? target.offsetTop - scrollTopGap : 0);
};

const App = React.createClass({
  getInitialState() {
    return {
      route: window.location.hash.substr(1).split('#')[0]
    }
  },
  componentDidMount() {
    window.addEventListener('hashchange', () => {
        let hash = window.location.hash.substr(1).split('#');
        this.setState({
            route: hash[0]
        });
        scrollToTarget(hash[1]);
    });
  },

  render() {
    let Child = routeConf.routes[this.state.route];
    
    // redirect to Main
    if(!Child) {
        window.location.hash = '#/';
        Child = Main;
    }
    return (
        <div>
            <Header/>
            <Nav/>
            <div id="contentWrap">
                <Child />
            </div>
        </div>
    )
  }
});

render((
    <App />
), document.getElementById('reactWrap'));