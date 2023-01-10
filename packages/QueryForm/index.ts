import QueryForm from "./QueryForm.vue";

(QueryForm as any).install = (app: any) => {
    app.component(QueryForm.name, QueryForm);
}

export default QueryForm;