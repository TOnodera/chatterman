const view = {
    state: {
        toggleButtonClicked: false //スマホ、パッド端末時のサイドバー表示ボタンがクリックされたかどうか
    },
    toggle(func: Function){
        this.state.toggleButtonClicked = !this.state.toggleButtonClicked;
        func(this.state.toggleButtonClicked);
    }
};

export default view;