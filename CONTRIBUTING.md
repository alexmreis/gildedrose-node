# Contributing

## Commit messages

This repo uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). Write every commit subject as:

```
<type>[optional scope]: <description>
```

Use one of these types:

| Type       | Use for                                             |
| ---------- | --------------------------------------------------- |
| `feat`     | New behaviour                                       |
| `fix`      | A bug fix                                           |
| `refactor` | A code change that doesn't change behaviour         |
| `test`     | Adding or changing tests                            |
| `docs`     | Documentation only                                  |
| `build`    | Dependencies or build configuration                 |
| `ci`       | CI configuration                                    |
| `chore`    | Anything else that doesn't touch source or tests    |

Examples:

```
feat: support Conjured items
refactor: extract item update rules from updateQuality
test: cover Sulfuras quality in approval tests
```

Mark a breaking change with `!` after the type or scope, and describe it in a `BREAKING CHANGE:` footer.
