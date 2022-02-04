export enum ProductStatus {
    WAITING = "Proses Verifikasi",
    APPROVED = "Produk Terverifikasi",
    REJECTED = "Produk Ditolak",
    ACTIVE = "Produk Aktif",
    NON_ACTIVE = "Produk Nonaktif",
}

export namespace ProductStatus {
    export function valueOf(request: string): string {
        for(const productStatus in ProductStatus) {
            if (request === ProductStatus[productStatus]) {
                return productStatus;
            }
        }
    }
}
