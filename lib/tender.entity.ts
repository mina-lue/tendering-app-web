export interface Tender {
  id: number;

  organizationId: number;
  
  details: string;

  openAt: Date;

  closeAt: Date;

  document_buy_option: boolean;

  urlToDoc?: string;
  documentPrice?: string;

  status: 'CLOSED' | 'OPEN' | 'DRAFT';

  updatedAt: Date;
}

export interface TenderResponsesForAdmin {
   id: number;

  organization: {
    id: number;
    name: string;
  };
  
  details: string;

  openAt: Date;

  closeAt: Date;

  document_buy_option: boolean;

  urlToDoc?: string;
  documentPrice?: string;

  status: 'CLOSED' | 'OPEN' | 'DRAFT';

  updatedAt: string;
}