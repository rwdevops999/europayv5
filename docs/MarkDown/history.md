# HISTORY

## create a history entry

To create a history entry, we use the method

```typescript
export const createHistoryEntry = async (
  _type: HistoryType,
  _allowedTypes: HistoryType[],
  _template: string,
  _params: Record<string, string>,
  _originator: string
);
```

### \_type: HistoryType

The type of entry we want to make.
Allowed values are:

- HistoryType.INFO
- HistoryType.ACTION

### \_allowedTypes: HistoryType[]

Defined which types can be created in the history table.
These values are at startup taken from the env and put in the Settings table.
We can inspect these values using the useHistorySettings hook 5see beneath)

### \_template

The template name to use for filling in the description field of the history table.

### \_params

Parameters as described in the templates file or database table, to resolve the parameters in the template content.

### \_originator

Just an indication where the entry is created (e.g 'LoginScreen');

## useHistorSettings hook

The useHistorySettings hook hans only one method of interest to use with creation of an history entry.

### getHistory()

The method returns an array of HistoryType, which can be used in the create history entry method call.

EXAMPLE:

```typescript
const { getHistory } = useHistorySettings();

const createHistoryEntry = async (
  HistoryType.INFO,
  getHistory(),
  "HISTORY_TEMPLATE_1",
  {"email": "test@test.com", "user": "testuser"},
  "Somewhere""
);
```
