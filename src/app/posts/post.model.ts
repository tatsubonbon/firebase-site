export class Post {
    public name: string;
    public description: string;
    public imagePath: string;
    public uid: string;

    constructor(name: string, desc: string, imagePath: string, uid: string) {
        this.name = name;
        this.description = desc;
        this.imagePath = imagePath;
        this.uid = uid;
    }
}