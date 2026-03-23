export const EimzoBase64 = {
  encode: (s: string): string => {
    const bytes = new TextEncoder().encode(s)

    const binString = Array.from(bytes, (byte) =>
      String.fromCharCode(byte),
    ).join('')

    return btoa(binString)
  },
}
