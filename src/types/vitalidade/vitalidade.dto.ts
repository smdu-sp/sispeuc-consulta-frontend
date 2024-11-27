export interface VitalidadeSuccessDTO {
  status: string;
  info: { 
    database: { 
      status: string 
    } 
  };
  error: {};
  details: {
    database: {
      status: string
    }
  }
}

export interface VitalidadeErrorDTO {
  status: string;
  info: {
    database: {
      status: string
    }
  },
  error: {
    redis: {
      status: string,
      message: string
    }
  },
  details: {
    database: {
      status: string
    },
    redis: {
      status: string,
      message: string
    }
  }
}
