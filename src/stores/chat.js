import { observable, action } from "mobx";

class Store {
  @observable name;

  constructor() {
    this.name = localStorage.name || null;
    console.log("this.name=", this.name);
  }

  @action setName = name => {
    localStorage.name = name;
    this.name = name;
  };
}

export default new Store();
