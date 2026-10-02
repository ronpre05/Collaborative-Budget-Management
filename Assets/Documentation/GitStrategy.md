# Git Strategy

1. Only the git admin can merge to main
2. main should be untouched unless merging code from dev
3. We will branch for each feature (user story) off of dev
4. Merge requests into dev from a feature will be assigned to someone not working on the same feature
5. Issues will be created for each feature and bug
6. Issues will be labeled based on bug, feature, etc...
7. Branches for feature should be named "feature/[feature-name]"
8. Commit names should be descripitve on any changes made
9. Commits from a issue branch should include the issue id
10. Milestones will be created for each sprint and applied to the relavant issues
11. Issue descriptions will follow the provided template for the given label

---

### Process to start a new feature branch

1. At the start of a sprint, we will create issues of all the user stories we plan to complete
2. These issues will be assigned to the relavant team members
3. Branches will be created from these issues (branching off dev)
4. Merge requests can then be made to merge back into dev once the code has been reviewed and passes all relavant tests
