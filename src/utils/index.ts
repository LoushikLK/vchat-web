export const formatDate = (date: string | Date) =>
  new Intl.DateTimeFormat("en-in").format(new Date(date));
