export class Chat {
  public uid: string;

  constructor(
    public lastMessage: string,
    public timestamp: object,
    public title: string,
    public photo: string
  ) {

  }

}
