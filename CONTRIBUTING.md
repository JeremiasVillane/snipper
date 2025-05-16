# Contributing to This Project

Thank you for your interest in contributing to this project! By submitting code, documentation, or any other contributions, you agree that your work will be published under the PolyForm Noncommercial 1.0.0 license and incorporated into the repository under the same terms.

---

## Table of Contents

1. [Reporting Bugs](#reporting-bugs)
2. [Feature Requests](#feature-requests)
3. [Code Style Guide](#code-style-guide)
4. [Pull Request Workflow](#pull-request-workflow)
5. [Tests and Quality](#tests-and-quality)
6. [Contribution Certification (DCO)](#contribution-certification-dco)
7. [Contact and Acknowledgments](#contact-and-acknowledgments)

---

## Reporting Bugs

1. Check the [Issues](https://github.com/JeremiasVillane/snipper/issues) page to see if the bug has already been reported.
2. If not, open a new issue including:

   - A clear, descriptive title.
   - Steps to reproduce the problem.
   - Expected vs. actual behavior.
   - Relevant details: project version, environment, browser, error logs, etc.

---

## Feature Requests

1. Before implementing a new feature, open an issue describing:

   - The use case.
   - Benefits for users.
   - Proposed design or mockups (if applicable).

2. Wait for feedback and discussion on the issue before starting development.

---

## Code Style Guide

- **Language:** TypeScript with React 19.
- **Formatting:** Follow Prettier and ESLint rules configured in the project.
- **Tailwind CSS:** Organize utilities logically (layout, spacing, typography, color).
- **Naming:** Use `camelCase` and descriptive names for functions, variables, and components.
- **Comments:** Add comments only when the code isn’t self-explanatory.

---

## Pull Request Workflow

1. **Fork** the repository to your GitHub account.
2. Create a new branch for your changes:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make atomic commits with clear messages:

   ```bash
   git commit -m "feat(ui): add Button component with variants"
   git commit -m "fix(api): handle errors in fetchToApi"
   ```

4. **Push** your branch to GitHub:

   ```bash
   git push origin feature/your-feature-name
   ```

5. Open a **Pull Request** against the `main` branch of the original repository.
6. In your PR description, include:

   - A summary of changes.
   - Related issue number using `Closes #XX`.
   - Screenshots or GIFs for visual changes.

Maintainers will review your PR, provide feedback, and request adjustments if needed.

---

## Tests and Quality

- Add or update unit tests using Jest (or your preferred testing framework).
- Ensure all tests pass:

  ```bash
  npm test
  ```

- Verify linting is clean:

  ```bash
  npm run lint
  ```

---

## Contribution Certification (DCO)

To confirm we have the right to use your contributions under the PolyForm Noncommercial 1.0.0 license, please follow the **Developer Certificate of Origin** (DCO):

1. Add this line to your commit messages:

   ```
   Signed-off-by: Your Name <your.email@example.com>
   ```

2. When you open a PR, GitHub Actions will verify that all commits include a `Signed-off-by` line.

If you forget, the bot will remind you, and you can amend your commit:

```bash
git commit --amend --signoff
git push --force
```

---

## Contact and Acknowledgments

Thank you for helping improve this project! For general questions, open an issue or reach out on Twitter: [@snipper](https://twitter.com/snipper).

> This project exists thanks to the contributions of the community. 🎉
