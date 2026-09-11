export interface CountryProps {
    id: string;
    name: string;
    dialCode: string;
    flag: string;
    maxLength: number;
}
export const COUNTRIES: CountryProps[] = [
    { id: "IN", name: "India", dialCode: "+91", flag: "🇮🇳", maxLength: 10 },
    {
        id: "US",
        name: "United States",
        dialCode: "+1",
        flag: "🇺🇸",
        maxLength: 10,
    },
    {
        id: "UK",
        name: "United Kingdom",
        dialCode: "+44",
        flag: "🇬🇧",
        maxLength: 10,
    },
    {
        id: "AE",
        name: "United Arab Emirates",
        dialCode: "+971",
        flag: "🇦🇪",
        maxLength: 9,
    },
    { id: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦", maxLength: 10 },
];
