declare module 'google' {
  const google: {
    (search: string, cb: (err: any, res: any) => void),
    resultsPerPage: number
  };

  export = google;
}

