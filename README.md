# Multimodal LLM-Based Testing Instruction Generator : testGPT

This tool uses a multimodal Large Language Model (LLM) to generate detailed testing instructions for digital product features based on screenshots. By uploading screenshots and providing optional context, the tool outputs step-by-step testing guides, including descriptions, pre-conditions, testing steps, and expected results.

## Features

- **Text Box for Optional Context**: Allows users to provide additional context or specific details about the features to be tested.
- **Multi-Image Uploader**: Users can upload multiple screenshots of the digital product's features.
- **Generate Testing Instructions**: A button to trigger the LLM to process the inputs and generate detailed testing instructions.
- **Output**: A step-by-step guide on how to test each feature, including:
  - **Description**: Overview of what the test case is about.
  - **Pre-conditions**: Requirements that need to be set up before testing.
  - **Testing Steps**: Clear instructions on how to execute the test.
  - **Expected Result**: The expected outcome if the feature works correctly.

## Tech Stack

- **Front-end**: HTML, CSS, JavaScript, and optionally React for a more dynamic interface.
- **Back-end**: Flask (Python) or Node.js with Express.
- **LLM Integration**: Using a multimodal LLM model from OpenAI, Hugging Face, or another provider that supports image and text input.

## Getting Started

### Prerequisites

- **Node.js** and **npm** (for React-based front-end).
- **Python** and **pip** (for Flask back-end).
- Access to a multimodal LLM model that can process images and text inputs (like OpenAI's DALL-E or similar models from Hugging Face).
  <img src="https://github.com/hpk22/testGPT-llm/blob/7d577888edd92a667c1f2416475c526c11cd7a09/screenshots/ss01.jpg" alt="Your image title" width="250"/>

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/hpk22/test-GPT-llm.git
   cd multimodal-llm-testing-instructions
   Install my-project with npm
- Front-end setup: 
```bash
npx create-react-app client
```
```bash
npm install axios
```
```bash
npm start
```
- Back-end setup

```bash
python -m venv venv
```
- Install required dependencies
```bash
pip install flask flask-cors python-dotenv openai Werkzeug
```
- Run flask application 
```bash
python app.py
```
### How to access the application
Access the Application
Open your browser and navigate to ```http://localhost:3000``` (for React) or the relevant URL for your front-end setup.
