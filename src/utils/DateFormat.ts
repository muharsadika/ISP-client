export const dateFormat = (tanggal: string) => {
  const date = new Date(tanggal);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};