'useClient'

import { EstadoService } from '@/demo/service/cadastro/EstadoService';
import React, { useEffect, useRef, useState } from 'react';
import { Estado } from '@/types';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';


const Cadastros = () => {
    const objetoNovo: Estado = {
        id: '',
        nome: '',
        sigla: '',
        inventoryStatus: 'INSTOCK'
    };

    const estadoService = new EstadoService();
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [objetos, setObjetos] = useState<Estado[]>([]);
    const [objetoDialog, setObjetoDialog] = useState(false);
    const [objetoDeleteDialog, setObjetoDeleteDialog] = useState(false);
    const [objeto, setObjeto] = useState<Estado>(objetoNovo);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = EstadoService.buscarTodos();
                setObjeto(response);
            } catch (error) {
                console.error('Erro ao carregar estados:', error);
                if (toast.current) {
                    toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar estados. Por favor, tente novamente mais tarde.', life: 3000 });
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

        if (objeto.nome.trim() && objeto.sigla.trim()) {
            try {
                let _objeto = { ...objeto };
                if (_objeto.id) {
                    EstadoService.alterarEstado(_objeto);
                } else {
                    EstadoService.inserirEstado(_objeto);
                }
                if (toast.current) {
                    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: _objeto.id ? 'Atualização do Estado' : 'Inserção de Estado', life: 3000 });
                }
                setObjeto(objetoNovo);
                setObjetoDialog(false);

            } catch (error) {
                console.error('Erro ao salvar estado:', error);
                if (toast.current) {
                    toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao salvar estado. Por favor, tente novamente mais tarde.', life: 3000 });
                }
            }
        }
    }

    const editObjeto = (objeto: Estado) => {
        setObjeto({ ...objeto });
        setObjetoDialog(true);
    }

    const confirmDeleteObjeto = (objeto: Estado) => {
        setObjeto(objeto);
        setObjetoDeleteDialog(true);
    }

    const deleteObjeto = async () => {
        try {
            EstadoService.excluirEstado(objeto.id);
            if (toast.current) {
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Removido', life: 3000 });
            }
            setObjetoDeleteDialog(false);
            window.location.reload();
        } catch (error) {
            console.error('Erro ao excluir estado:', error);
            if (toast.current) {
                toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Falha ao excluir estado. Por favor, tente novamente mais tarde.', life: 3000 });
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

    const idBodyTemplate = (rowData: Estado) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id}
            </>
        );
    }

    const nomeBodyTemplate = (rowData: Estado) => {
        return (
            <>
                <span className="p-column-title">Nome</span>
                {rowData.nome}
            </>
        );
    }

    const siglaBodyTemplate = (rowData: Estado) => {
        return (
            <>
                <span className="p-column-title">Sigla</span>
                {rowData.sigla}
            </>
        );
    }

    const actionBodyTemplate = (rowData: Estado) => {
        return (
            <div>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editObjeto(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteObjeto(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Estados</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
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
                        currentPageReportTemplate="Mostrando {first} de {last}. Total de {totalRecords} Estados"
                        globalFilter={globalFilter}
                        emptyMessage="Sem objetos cadastrados."
                        header={header}
                    >
                        <Column field="id" header="Id" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="nome" header="Nome" sortable body={nomeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="sigla" header="Sigla" sortable body={siglaBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={objetoDialog} style={{ width: '450px' }} header="Cadastrar" modal className="p-fluid" onHide={hideDialog}>

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
                            {submitted && !objeto.sigla && <small className="p-invalid">A Sigla obrigatório!</small>}
                        </div>

                    </Dialog>

                    <Dialog visible={objetoDeleteDialog} style={{ width: '450px' }} header="Confirm" modal onHide={hideDeleteObjetoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {objeto && (
                                <span>
                                    Deseja Excluir <b>{objeto.nome}</b>?
                                </span>
                            )}
                        </div>
                        <div className="mt-4 text-center">
                            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDeleteObjetoDialog} />
                            <Button label="Confirmar" icon="pi pi-check" className="p-button-text" onClick={deleteObjeto} />
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};


export default Cadastros;
