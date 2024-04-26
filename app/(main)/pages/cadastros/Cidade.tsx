'use client';

import { CidadeService } from "@/demo/service/cadastros/CidadeService";
import { Cidade } from "@/types";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { classNames } from "primereact/utils";
import { useEffect, useRef, useState } from "react";

const Cadastros = () => {
    const objetoNovo: Cidade = {
        id: '',
        nome: '',
        sigla: '',
        inventoryStatus: 'INSTOCK'
    };

    const [objetos, setObjetos] = useState<Cidade[]>([]);
    const [objetoDialog, setObjetoDialog] = useState(false);
    const [objetoDeleteDialog, setObjetoDeleteDialog] = useState(false);
    const [objeto, setObjeto] = useState<Cidade>(objetoNovo);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const serviceCidade = new CidadeService();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await serviceCidade.buscarTodos();
                setObjetos(response.data);
            } catch (error) {
                console.error('Erro ao carregar cidades:', error);
                if (toast.current) {
                    toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar cidades. Por favor, tente novamente mais tarde.', life: 3000 });
                }
            }
        };

        fetchData();
    }, []);

    const openNew = () => {
        setObjeto(objetoNovo);
        setSubmitted(false);
        setObjetoDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setObjetoDialog(false);
    }

    const hideDeleteObjetoDialog = () => {
        setObjetoDeleteDialog(false);
    }

    const saveObjeto = async () => {
        setSubmitted(true);

        if (objeto.nome.trim()) {
            try {
                let _objeto = { ...objeto };
                if (objeto.id) {
                    CidadeService.alterarCidade(_objeto);
                    if (toast.current) {
                        toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Atualização do Cidade', life: 3000 });
                    }
                } else {
                    CidadeService.inserirCidade(_objeto);
                    if (toast.current) {
                        toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Inserção de Cidade', life: 3000 });
                    }
                }
                setObjetos([]);
                setObjetoDialog(false);
                setObjeto(objetoNovo);
                window.location.reload();
            } catch (error) {
                console.error('Erro ao salvar cidade:', error);
                if (toast.current) {
                    toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao salvar cidade. Por favor, tente novamente mais tarde.', life: 3000 });
                }
            }
        }
    }

    const editObjeto = (objeto: Cidade) => {
        setObjeto({ ...objeto });
        setObjetoDialog(true);
    }

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteObjeto = (objeto: Cidade) => {
        setObjeto(objeto);
        setObjetoDeleteDialog(true);
    }

    const deleteObjeto = async () => {
        try {
            CidadeService.excluirCidade(objeto.id);
            if (toast.current) {
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Removido', life: 3000 });
            }
            setObjetos([]);
            setObjetoDeleteDialog(false);
            window.location.reload();
        } catch (error) {
            console.error('Erro ao excluir cidade:', error);
            if (toast.current) {
                toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao excluir cidade. Por favor, tente novamente mais tarde.', life: 3000 });
            }
        }
    }

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = e.currentTarget.value;
        let _objeto = { ...objeto };
        _objeto[name] = val;
        setObjeto(_objeto);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="my-2">
                <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteObjeto} disabled={!objetos || !objetos.length} />
            </div>
        );
    };

    const idBodyTemplate = (rowData: Cidade) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id}
            </>
        );
    }

    const nomeBodyTemplate = (rowData: Cidade) => {
        return (
            <>
                <span className="p-column-title">Nome</span>
                {rowData.nome}
            </>
        );
    }

    const siglaBodyTemplate = (rowData: Cidade) => {
        return (
            <>
                <span className="p-column-title">Sigla</span>
                {rowData.sigla}
            </>
        );
    }

    const actionBodyTemplate = (rowData: Cidade) => {
        return (
            <div>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editObjeto(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteObjeto(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Cidades</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const objetoDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={saveObjeto} />
        </>
    );

    const deleteObjetoDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteObjetoDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteObjeto} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={objetos}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} de {last}. Total de {totalRecords} Cidades"
                        globalFilter={globalFilter}
                        emptyMessage="Sem objetos cadastrados."
                        header={header}
                    >
                        <Column field="id" header="Id" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="nome" header="Nome" sortable body={nomeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="sigla" header="Sigla" sortable body={siglaBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={objetoDialog} style={{ width: '450px' }} header="Cadastrar" modal className="p-fluid" footer={objetoDialogFooter} onHide={hideDialog}>

                        <div className="field">
                            <label htmlFor="nome">Nome</label>
                            <InputText
                                id="nome"
                                value={objeto.nome}
                                onChange={(e) => onInputChange(e, 'nome')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !objeto.nome
                                })}
                            />
                            {submitted && !objeto.nome && <small className="p-invalid">O nome é obrigatório!</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="sigla">Sigla</label>
                            <InputText
                                id="sigla"
                                value={objeto.sigla}
                                onChange={(e) => onInputChange(e, 'sigla')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !objeto.sigla
                                })}
                            />
                            {submitted && !objeto.sigla && <small className="p-invalid"> Sigla obrigatório!</small>}
                        </div>

                    </Dialog>

                    <Dialog visible={objetoDeleteDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteObjetoDialogFooter} onHide={hideDeleteObjetoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {objeto && (
                                <span>
                                    Deseja Excluir <b>{objeto.nome}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Cadastros;