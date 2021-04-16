class ViewStore {
    static isVisibleSideMenu: boolean;
    static handler: Function;

    static set (value: boolean) {
      this.isVisibleSideMenu = value;
      this.handler(this.isVisibleSideMenu);
    }

    static get () {
      this.isVisibleSideMenu;
    }
}

export default ViewStore;
