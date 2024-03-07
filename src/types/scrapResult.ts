export type scrapResult = {
  company: company[];
};

export type company = {
  domain: string;
  company_commercial_name?: string;
  company_legal_name?: string;
  company_all_available_names: string[];
  emails: string[];
  phoneNumbers: string[];
  socialMediaLinks: string[];
  adress?: string;
};
