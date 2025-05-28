# Steps to Create Experiment: Study of CRO, Multimeter

Welcome to the experiment development guide for the **Study of CRO, Multimeter** experiment in the Virtual Labs project. This document will guide developers through the process of creating, organizing, and maintaining the experiment.

---

## Verify and Understand the Experiment Repositories

Begin by thoroughly reviewing the experiment repositories' structure and purpose. More information can be found [here](https://vlead.vlabs.ac.in/development/#development-process).

---

## Repository Creation

The VLEAD team creates a GitHub repository for each experiment. Write access is necessary to create, edit, or modify the experiment content. Refer to this [example repository](https://github.com/virtual-labs-cms/exp-template) for the standard structure and format.

---

## Branch Structure

Each experiment repository contains these branches:

- **dev** (development)
- **testing** (end-to-end testing)
- **gh-pages** (for GitHub Pages hosting)
- **main** (production-ready)

Developers must work exclusively in the **dev** branch. After thorough testing, merge the **dev** branch into **testing** for deployment to GitHub Pages.

---

## Content for Experiment Development

Please maintain the following file names and content structure:

1. ### aim.md  
   Define the objectives and goals of the experiment, explaining what students will learn about CRO and multimeter.

2. ### study-of-cro-multimeter.md  
   This main content page should carry the experiment title clearly:  
   **Study of CRO, Multimeter**.

3. ### pretest.json and posttest.json  
   Contain quizzes to assess learner knowledge:  
   - **Pretest:** Knowledge before starting the experiment  
   - **Posttest:** Knowledge after completing the experiment  
   Use the JSON format detailed [here](https://github.com/virtual-labs/ph3-lab-mgmt/blob/dev/docs/quiz.md). Validate JSON using https://jsonlint.com/.

4. ### theory.md  
   Explain the working principles, components, and usage of CRO and multimeter. Include images, diagrams, and LaTeX where applicable.

5. ### procedure.md  
   Provide a detailed, step-by-step procedure to conduct the experiment virtually, including screenshots or simulation instructions.  
   Refer to this [example procedure](https://virtual-labs.github.io/exp-adder-circuit-iiith/procedure.html).

6. ### simulation folder  
   Contains files required for interactive simulations:  

   - **css/** – stylesheets  
   - **js/** – JavaScript files  
   - **images/** – diagrams, icons  

   The main simulation HTML page must be named **index.html**.

7. ### reference.md  
   List all references, textbooks, websites, and sources used for content development.

---

## Do’s and Don’ts

### Do’s:
- Work only in the **dev** branch and merge tested changes into **testing**.  
- Follow best development practices as detailed [here](https://vlead.vlabs.ac.in/development/#best-practices).  
- Ensure the main simulation page is named **index.html**.

### Don’ts:
- Avoid committing unnecessary or unrelated files.  
- Never delete the **gh-pages** branch, as it handles automatic deployment.

---

## Additional Resources

- [Virtual Labs Onboarding Process](https://vlead.vlabs.ac.in/development/#onboarding-process)  
- [Virtual Labs Development Process](https://vlead.vlabs.ac.in/development/#development-process)  
- [Virtual Labs Hosting Process](https://vlead.vlabs.ac.in/development/#hosting-process)

---

This guide completes the setup instructions for the **Study of CRO, Multimeter** experiment. Follow these carefully to develop a consistent, quality Virtual Lab experiment.
