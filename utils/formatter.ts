export function formatPhoneNumber(phone: string) {
  // Strip out all non-digit characters
  let digits = phone.replace(/\D/g, "")

  // Check if it's a US number (assuming +1 or no country code means US)
  if (digits.length === 11 && digits[0] === "1") {
    // US number with country code, remove the leading 1
    digits = digits.slice(1)
  }

  // Format US numbers: (XXX) XXX-XXXX
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }

  // For non-US numbers, return the original input or apply specific formatting
  return phone
}
