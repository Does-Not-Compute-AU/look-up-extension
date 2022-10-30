declare namespace UpAccount {
    export interface Balance {
        currencyCode: string;
        value: string;
        valueInBaseUnits: number;
    }

    export interface Attributes {
        displayName: string;
        accountType: string;
        ownershipType: string;
        balance: Balance;
        createdAt: Date;
    }

    export interface Links {
        related: string;
    }

    export interface Transactions {
        links: Links;
    }

    export interface Relationships {
        transactions: Transactions;
    }

    export interface Links2 {
        self: string;
    }

    export interface Account {
        type: string;
        id: string;
        attributes: Attributes;
        relationships: Relationships;
        links: Links2;
    }
}

declare namespace UpTransaction {

    export interface Amount {
        currencyCode: string;
        value: string;
        valueInBaseUnits: number;
    }

    export interface HoldInfo {
        amount: Amount;
        foreignAmount?: any;
    }

    export interface CardPurchaseMethod {
        method: string;
        cardNumberSuffix: string;
    }

    export interface ForeignAmount {
        currencyCode: string;
        value: string;
        valueInBaseUnits: number;
    }

    export interface Attributes {
        status: string;
        rawText: string;
        description: string;
        message?: string;
        isCategorizable: boolean;
        holdInfo: HoldInfo;
        roundUp?: any;
        cashback?: any;
        amount: Amount;
        foreignAmount: ForeignAmount;
        cardPurchaseMethod: CardPurchaseMethod;
        settledAt?: any;
        createdAt: Date;
    }

    export interface Data {
        type: string;
        id: string;
    }

    export interface Links {
        related: string;
    }

    export interface Account {
        data: Data;
        links: Links;
    }

    export interface TransferAccount {
        data?: any;
    }

    export interface Links2 {
        self: string;
        related: string;
    }

    export interface Category {
        data: Data;
        links: Links2;
    }

    export interface Links3 {
        related: string;
    }

    export interface ParentCategory {
        data: Data;
        links: Links3;
    }

    export interface Links4 {
        self: string;
    }

    export interface Tags {
        data: any[];
        links: Links4;
    }

    export interface Relationships {
        account: Account;
        transferAccount: TransferAccount;
        category: Category;
        parentCategory: ParentCategory;
        tags: Tags;
    }

    export interface Links5 {
        self: string;
    }

    export interface Transaction {
        type: string;
        id: string;
        attributes: Attributes;
        relationships: Relationships;
        links: Links5;
    }
}


