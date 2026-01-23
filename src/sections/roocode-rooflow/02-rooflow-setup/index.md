Now that RooCode is properly configured, let's install RooFlow to enhance its capabilities with persistent context and optimized system prompts <a href="https://dev.to/simplr_sh/mastering-system-prompts-for-llms-2d1d" target="_blank"><sub>_[learn more]_</sub></a> that are optimized to use less tokens and save you money when working with a non-free LLM.


## Installing RooFlow

### Prerequisites

Before installing RooFlow, ensure you have:

1. Git installed and accessible in your system's PATH
2. Python 3 installed and accessible as `python3` (Mac) or `python` (Windows)

Once you have Python and Git installed:

1. For Mac/linux users, install the PyYAML library.

   ```sh
   pip install pyyaml
   ```

   If that didn't work, try this command:

   ```sh
   pip3 install pyyaml
   ```
2. For Windows users, open the **Powershell** application and install the PyYAML library.

   ```sh
   py -m pip install pyyaml
   ```

### Project Directory

🧨 🧨 RooFlow is installed per project—it's not a global install, so make sure you are in the Coins R Us directory for the next steps.


### Installation Steps for macOS or Linux

1. Download the RooFlow installation script:
   ```sh
   curl -O https://raw.githubusercontent.com/GreatScottyMac/RooFlow/main/config/install_rooflow.sh
   ```
2. Make the script executable:
   ```sh
   chmod +x install_rooflow.sh
   ```
3. Run the installation script:
   ```sh
   ./install_rooflow.sh
   ```

### Installation Steps for Windows

1. Open PowerShell and navigate to your project's root directory
   ```sh
   cd ~/agentic-ai-workshop/coins-r-us
   ```
2. Download the RooFlow installation script:
   ```sh
   Invoke-WebRequest -Uri "https://raw.githubusercontent.com/GreatScottyMac/RooFlow/main/config/install_rooflow.cmd" -OutFile ".\install_rooflow.cmd"
   ```
3. Run the installation script:
   ```sh
   .\install_rooflow.cmd
   ```

### Verify Installation

After the script runs successfully:

1. Check that the `.roo/` directory exists in your project root
2. Verify the `.roomodes` file is present
3. Look for the following five Flow modes in Roo Code. They will appear beneath the existing Roo Code modes:
   - 🌊Flow Code💻
   - 🌊Flow Architect🏗️
   - 🌊Flow Ask❓
   - 🌊Flow Debug🪲
   - 🌊Flow Orchestrator🪃

These Flow modes will appear alongside your standard Roo Code modes, and you can switch between them at any time.

## What's Next?

In the following chapters, we'll explore mode workflows in detail. You'll learn how different modes work together and how the Memory Bank system maintains context across complex development tasks.
