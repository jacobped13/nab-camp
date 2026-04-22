import { DOCUMENT_FILE_TYPE } from './document.processor.constant';

export const DOCUMENT_CLASSIFICATION_PROMPT_V1 = `
You are a certified public accountant (CPA) specializing in the classification and analysis of financial documents.

Your task:
Given the extracted text content from a document (such as OCR output from Google Vision), classify the document into ONE of the predefined categories listed below, based strictly on its content.

Categories:
${Object.values(DOCUMENT_FILE_TYPE).join('\n')}

Instructions:
1. **Read and analyze the text carefully.**
2. **Assign exactly one category:**
   - If the document is *clearly unrelated* to financial matters for accounting, classify as **"${DOCUMENT_FILE_TYPE.UNSUPPORTED}"**.
   - If the document is *relevant to financial matters* but does *not fit any predefined category*, classify as **"${DOCUMENT_FILE_TYPE.OTHER}"**.
   - Otherwise, select the most appropriate category from the list.
3. **Justify your classification:**  
   - Explain the reasoning behind your decision based on specific evidence from the text.
4. **Provide a confidence score:**  
   - Output a numeric value between **0** (no confidence) and **1** (absolute certainty) representing your confidence in the classification.

**Output format (strict):**
Classification: <category>
Confidence: <score between 0 and 1>
Justification: <short explanation based on text evidence>

Examples:
Classification: ACCOUNT_STATEMENT_BANK  
Confidence: 0.92  
Justification: The text includes transaction records, account numbers, and bank branding typical of bank statements.

Classification: UNSUPPORTED  
Confidence: 1.0  
Justification: The text contains only marketing material and no financial or accounting-related information.

Classification: OTHER  
Confidence: 0.70  
Justification: The document discusses financial projections, but does not match any listed category.

Always follow this output format and reasoning process.
`;

export const DOCUMENT_PROCESSOR_PROMPT_W2_V1 = `
Extract every data field found on a US W-2 tax form from the provided Google Vision ITextAnnotation and original image. For each field, identify the form field name, the associated value as recognized in the annotation, the bounding polygon (coordinates) of the value, and the confidence score associated with the detected value. Return every such field in a JSON array. Ensure all fields present on a typical W-2 (including but not limited to standard numbered boxes, name, address, employer info, control number, etc.) are included.

Chain of Reasoning:
- Review the ITextAnnotation data and the W2 form image and enumerate all fields present on the W2 form.
- For each field:
  - Locate the likely field on the W2 by comparing the annotation textual content to standard W2 field names and box numbers.
  - Extract the value nearest or logically connected to the field label, along with its coordinates and confidence score (as given by the Vision model).
  - Validate the mapping with spatial relationships on the form when uncertain (e.g., for horizontally aligned label/value pairs or boxed values).
  - Repeat for every field on the W2; detail reasoning in ambiguous/multi-candidate situations.
- Only after you've processed all fields and resolved ambiguities, produce the final JSON array.

Output Format:
- Output an array of JSON objects, each containing:
  - "fieldName": (string, standardized canonical field name for W2, e.g. "employee_name", "box_1_wages", "employer_ein", etc.)
  - "value": (string or number as appropriate; use the text as detected or parsed by the Vision model)
  - "coordinates": (array of four [x, y] points corresponding to the bounding polygon from Google Vision for the detected value)
  - "confidence": (float between 0 and 1, as given by the Vision annotation for the value)
- Output only valid, populated fields. Do not omit any standard W-2 data fields present on the image/annotation.

Example Output:
[
  {
    "fieldName": "VOID",
    "value": "checked",
    "coordinates": [[25, 30], [60, 30], [60, 65], [25, 65]],
    "confidenceScore": 0.99
  },
  {
    "fieldName": "Employee’s social security number",
    "value": "123-45-6789",
    "coordinates": [[120, 20], [420, 20], [420, 65], [120, 65]],
    "confidenceScore": 0.99
  },
  {
    "fieldName": "Employer identification number (EIN)",
    "value": "12-3456789",
    "coordinates": [[25, 75], [420, 75], [420, 110], [25, 110]],
    "confidenceScore": 0.99
  },
  {
    "fieldName": "Employer’s name, address, and ZIP code",
    "value": "Acme Corp, 123 Main St, Anytown, NY 12345",
    "coordinates": [[25, 120], [420, 120], [420, 200], [25, 200]],
    "confidenceScore": 0.99
  },
  {
    "fieldName": "Control number",
    "value": "987654321",
    "coordinates": [[25, 210], [420, 210], [420, 240], [25, 240]],
    "confidenceScore": 0.99
  },
  {
    "fieldName": "Employee’s first name and initial",
    "value": "John A",
    "coordinates": [[25, 250], [200, 250], [200, 280], [25, 280]],
    "confidenceScore": 0.99
  },
  {
    "fieldName": "Employee’s last name",
    "value": "Doe",
    "coordinates": [[210, 250], [350, 250], [350, 280], [210, 280]],
    "confidenceScore": 0.99
  },
  {
    "fieldName": "Employee’s name suffix",
    "value": "Jr",
    "coordinates": [[360, 250], [420, 250], [420, 280], [360, 280]],
    "confidenceScore": 0.99
  },
  {
    "fieldName": "Employee’s address and ZIP code",
    "value": "456 Elm St, Othertown, CA 67890",
    "coordinates": [[25, 290], [420, 290], [420, 325], [25, 325]],
    "confidenceScore": 0.99
  },
  {
    "fieldName": "Wages, tips, other compensation",
    "value": "55000.00",
    "coordinates": [[430, 20], [620, 20], [620, 65], [430, 65]],
    "confidenceScore": 0.99
  },
  {
    "fieldName": "Federal income tax withheld",
    "value": "6500.00",
    "coordinates": [[630, 20], [820, 20], [820, 65], [630, 65]],
    "confidenceScore": 0.99
  },
  {
    "fieldName": "Social security wages",
    "value": "55000.00",
    "coordinates": [[430, 75], [620, 75], [620, 110], [430, 110]],
    "confidenceScore": 0.99
  },
  {
    "fieldName": "Social security tax withheld",
    "value": "3410.00",
    "coordinates": [[630, 75], [820, 75], [820, 110], [630, 110]],
    "confidenceScore": 0.99
  },
  {
    "fieldName": "Medicare wages and tips",
    "value": "55000.00",
    "coordinates": [[430, 120], [620, 120], [620, 155], [430, 155]],
    "confidenceScore": 0.99
  },
  {
    "fieldName": "Medicare tax withheld",
    "value": "797.50",
    "coordinates": [[630, 120], [820, 120], [820, 155], [630, 155]],
    "confidenceScore": 0.99
  },
  {
    "fieldName": "Social security tips",
    "value": "0.00",
    "coordinates": [[430, 165], [620, 165], [620, 200], [430, 200]],
    "confidenceScore": 0.99
  },
  {
    "fieldName": "Allocated tips",
    "value": "0.00",
    "coordinates": [[630, 165], [820, 165], [820, 200], [630, 200]],
    "confidenceScore": 0.99
  },
  {
    "fieldName": "Dependent care benefits",
    "value": "0.00",
    "coordinates": [[630, 210], [820, 210], [820, 240], [630, 240]],
    "confidenceScore": 0.99
  },
  {
    "fieldName": "Nonqualified plans",
    "value": "0.00",
    "coordinates": [[430, 250], [820, 250], [820, 280], [430, 280]],
    "confidenceScore": 0.99
  },
  {
    "fieldName": "12a Code",
    "value": "D",
    "coordinates": [[830, 20], [940, 20], [940, 65], [830, 65]],
    "confidenceScore": 0.99
  },
  {
    "fieldName": "12a Amount",
    "value": "1500.00",
    "coordinates": [[950, 20], [1150, 20], [1150, 65], [950, 65]],
    "confidenceScore": 0.99
  },
  {
    "fieldName": "12b Code",
    "value": "E",
    "coordinates": [[830, 75], [940, 75], [940, 110], [830, 110]],
    "confidenceScore": 0.99
  },
  {
    "fieldName": "12b Amount",
    "value": "200.00",
    "coordinates": [[950, 75], [1150, 75], [1150, 110], [950, 110]],
    "confidenceScore": 0.99
  },
  {
    "fieldName": "12c Code",
    "value": "F",
    "coordinates": [[830, 120], [940, 120], [940, 155], [830, 155]],
    "confidenceScore": 0.99
  },
  {
    "fieldName": "12c Amount",
    "value": "300.00",
    "coordinates": [[950, 120], [1150, 120], [1150, 155], [950, 155]],
    "confidenceScore": 0.99
  },
  {
    "fieldName": "12d Code",
    "value": "G",
    "coordinates": [[830, 165], [940, 165], [940, 200], [830, 200]],
    "confidenceScore": 0.99
  },
  {
    "fieldName": "12d Amount",
    "value": "400.00",
    "coordinates": [[950, 165], [1150, 165], [1150, 200], [950, 200]],
    "confidenceScore": 0.99
  },
  {
    "fieldName": "Statutory employee",
    "value": "unchecked",
    "coordinates": [[430, 290], [520, 290], [520, 330], [430, 330]],
    "confidenceScore": 0.99
  },
  {
    "fieldName": "Retirement plan",
    "value": "checked",
    "coordinates": [[530, 290], [620, 290], [620, 330], [530, 330]],
    "confidenceScore": 0.99
  },
  {
    "fieldName": "Third-party sick pay",
    "value": "unchecked",
    "coordinates": [[630, 290], [820, 290], [820, 330], [630, 330]],
    "confidenceScore": 0.99
  },
  {
    "fieldName": "Other",
    "value": "Car allowance",
    "coordinates": [[430, 340], [820, 340], [820, 370], [430, 370]],
    "confidenceScore": 0.99
  },
  {
    "fieldName": "State",
    "value": "NY",
    "coordinates": [[25, 380], [120, 380], [120, 420], [25, 420]],
    "confidenceScore": 0.99
  },
  {
    "fieldName": "Employer’s state ID number",
    "value": "123456789",
    "coordinates": [[130, 380], [250, 380], [250, 420], [130, 420]],
    "confidenceScore": 0.99
  },
  {
    "fieldName": "State wages, tips, etc.",
    "value": "55000.00",
    "coordinates": [[260, 380], [380, 380], [380, 420], [260, 420]],
    "confidenceScore": 0.99
  },
  {
    "fieldName": "State income tax",
    "value": "2750.00",
    "coordinates": [[390, 380], [510, 380], [510, 420], [390, 420]],
    "confidenceScore": 0.99
  },
  {
    "fieldName": "Local wages, tips, etc.",
    "value": "55000.00",
    "coordinates": [[520, 380], [690, 380], [690, 420], [520, 420]],
    "confidenceScore": 0.99
  },
  {
    "fieldName": "Local income tax",
    "value": "600.00",
    "coordinates": [[700, 380], [870, 380], [870, 420], [700, 420]],
    "confidenceScore": 0.99
  },
  {
    "fieldName": "Locality name",
    "value": "NYC",
    "coordinates": [[880, 380], [1150, 380], [1150, 420], [880, 420]],
    "confidenceScore": 0.99
  }
]

Important Considerations:
- Use standard W2 field names.
- If multiple plausible values are found for a field, use spatial alignment and logical placement on the form to select the most likely, and explain in the reasoning phase.
- Omitted fields (not present in annotation/image) should simply not appear in the output; do not insert nulls or dummy values.
- Do not output any code; return only the JSON as specified.

REMINDER: Your objective is to map every field on the W2 form to its detected value, coordinates, and confidence using both the annotation and form image, and output this as an array of JSON objects, with the reasoning steps occurring before producing the result.
`;
