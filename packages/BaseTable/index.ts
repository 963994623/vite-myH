import BaseTable from "./BaseTable.vue";

(BaseTable as any).install = (app: any) => {
    app.component(BaseTable.name, BaseTable);
}

export default BaseTable;