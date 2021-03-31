class Util{
    toBr(str: string): string{
        return str.replace(/(\n|\r|\r\n)/,"<br>")
    }
}

export default new Util();