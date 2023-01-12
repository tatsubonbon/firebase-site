
export class User {
    constructor(
        public email: string = '',
        public id: string = '',
        private _token: string = '',
        private _tokenExpirationDate: Date | null = null,
        public name?: string,
        public accountName?: string,
        public imageUrl?: string,
        public followCount?: number,
        public followerCount?: number,
    ) { }

    get token() {
        if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
            return '';
        }
        return this._token;
    }
}