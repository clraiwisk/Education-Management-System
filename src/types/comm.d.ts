interface Edit<T> {
  isEdit: boolean;
  model: T;
  formRef: FormInstance | null;
  rules?: import('vue').Raw<FormRules>;
}

interface Dic {
  readonly dic_id: number;
  dic_name: string;
  dic_group_key: string;
  dic_group_name: string;
}