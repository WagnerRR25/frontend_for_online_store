'use client';
import { EstadoService } from "@/demo/service/cadastros/EstadoService";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { classNames } from "primereact/utils";
import React, { useEffect, useRef, useState } from "react";
import { EstadoItem } from '@/types';


const Cadastro = () => {
    let objetoNovo: EstadoItem.objeto = {
        id: '',
        name: '',
        sigla: '',
        inventoryStatus: 'INSTOCK'
    };

        const [objetos, setObjetos] = useState<EstadoItem[]>([]);
        const [objetoDialog, setObjetoDialog] = useState(false);
        const [objetoDeleteDialog, setObjetoDeleteDialog] = useState(false);
        const [objeto, setObjeto] = useState<EstadoItem>(objetoNovo);
        const [submitted, setSubmitted] = useState(false);
        const [globalFilter, setGlobalFilter] = useState('');
        const toast = useRef<Toast>(null);
        const dt = useRef<DataTable<any>>(null);
        const objetoService = new EstadoService();

        useEffect(() => {
            if (objetos.length === 0) {
            objetoService.estados().then(res => {
                setObjetos(res.data);
            });
            }
        }, [objetos]);

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

        const saveObjeto = () => {
            setSubmitted(true);

            if (objeto.nome.trim()) {
            let _objeto = { ...objeto };
            if (objeto.id) {
                objetoService.alterar(_objeto).then(data => {
                if (toast.current) {
                    toast.current.show({severity: 'success', summary: 'Sucesso', detail: 'Atualização do Estado', life: 3000});
                }
                setObjetos([]);
                });
            } else {
                objetoService.inserir(_objeto).then(data => {

                    toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Inserção de Estado', life: 3000});

                });
            }
            setObjetoDialog(false);
            setObjeto(objetoNovo);
            }
        }

        const editObjeto = (objeto: EstadoItem) => {
            setObjeto({ ...objeto });
            setObjetoDialog(true);
        }

        const exportCSV = () => {
            dt.current?.exportCSV();
        };

        const confirmDeleteObjeto = (objeto: EstadoItem) => {
            setObjeto(objeto);
            setObjetoDeleteDialog(true);
        }

        const deleteObjeto = () => {
            objetoService.excluir(objeto.id).then(data =>  {
            if (toast.current) {
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Removido', life: 3000});
            }
            setObjetos([]);
            setObjetoDeleteDialog(false);
            });
        }

        const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: keyof EstadoItem) => {
            const val = (e.target && e.target.value) || '';
            let _objeto = { ...objeto };
            _objeto[name] = val;
            setObjeto(_objeto);
        }

        const leftToolbarTemplate = () => {
            return (
            <div className="my-2">
                <Button label="Novo Estado" icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={deleteObjeto} disabled={!objetos || !(objetos as any).length} />
            </div>
            );
        }

        const idBodyTemplate = (rowData: EstadoItem) => {
            return (
            <>
                <span className="p-column-title">ID</span>
                {rowData.id}
            </>
            );
        }

        const nomeBodyTemplate = (rowData: EstadoItem) => {
            return (
            <>
                <span className="p-column-title">Nome</span>
                {rowData.nome}
            </>
            );
        }

        const siglaBodyTemplate = (rowData: EstadoItem) => {
            return (
            <>
                <span className="p-column-title">Sigla</span>
                {rowData.sigla}
            </>
            );
        }

        const actionBodyTemplate = (rowData: EstadoItem) => {
            return (
            <div>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editObjeto(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteObjeto(rowData)} />
            </div>
            );
        }

        const header = (
            <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage objetos</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)} placeholder="Search..." />
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
                    currentPageReportTemplate="Mostrando {first} de {last}. Total de {totalRecords} objetos"
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

const comparisonFn = function (prevProps: { location: { pathname: any; }; }, nextProps: { location: { pathname: any; }; }) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Cadastro, comparisonFn);
