# File Organizer

File Organizer is a command-line application built with JavaScript that helps users organize their files in a directory based on their file extensions. It provides a convenient way to sort and categorize files, making it easier to locate and manage them.

## Features

- Scans a specified directory and its subdirectories to retrieve all files.
- Determines the file extensions of the retrieved files.
- Checks if the file extensions are already registered in the `extension.json` file.
- If an extension is not registered, fetches the description for the extension from an external API and adds it to the `extension.json` file.
- Moves files to corresponding folders based on their extensions and descriptions.
- Generates a file movement tracker log that keeps a record of all file movements.

## Installation

1. Clone this repository to your local machine.
2. Navigate to the project directory.
3. Install the dependencies by running the following command:

```shell
pnpm install
```

4. Configure enviromental variable

```shell
X_RapidAPI_Key=
```
