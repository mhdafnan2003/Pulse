import { useEffect, useState, useRef } from 'react';
import { applyNowContentApi } from '../api';
import { useApplyNowContent } from '../context/ApplyNowContentContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Separator } from '../components/ui/separator';

const defaultForm = {
  basicBlock: { title: 'Basic Details', subtitle: '', fields: [] },
  requiredDocsBlock: { title: 'Required Documents', subtitle: '', documents: [] },
  additionalDocsBlock: { title: 'Additional Documents', subtitle: '', documents: [] },
};

const emptyField = {
  key: '',
  label: '',
  placeholder: '',
  type: 'text',
  required: true,
};

const emptyDoc = {
  key: '',
  label: '',
  required: false,
};

export default function ApplyNowContentForm() {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const { setApplyNowContent } = useApplyNowContent();
  
  // Refs for auto-focus
  const lastAddedFieldRef = useRef(null);
  const lastAddedReqDocRef = useRef(null);
  const lastAddedAddDocRef = useRef(null);
  const focusNewFieldRef = useRef(false);
  const focusNewReqDocRef = useRef(false);
  const focusNewAddDocRef = useRef(false);
  
  // Accordion state
  const [fieldOpenItems, setFieldOpenItems] = useState([]);
  const [reqDocOpenItems, setReqDocOpenItems] = useState([]);
  const [addDocOpenItems, setAddDocOpenItems] = useState([]);

  useEffect(() => {
    let mounted = true;
    applyNowContentApi.getAdmin()
      .then((res) => {
        if (mounted) {
          const data = res.data || {};
          setForm({
            ...defaultForm,
            ...data,
            basicBlock: { ...defaultForm.basicBlock, ...data.basicBlock },
            requiredDocsBlock: { ...defaultForm.requiredDocsBlock, ...data.requiredDocsBlock },
            additionalDocsBlock: { ...defaultForm.additionalDocsBlock, ...data.additionalDocsBlock },
          });
        }
      })
      .catch((err) => {
        if (mounted) setError(err.response?.data?.message || 'Failed to load apply now content');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, []);

  // Auto-focus on newly added field
  useEffect(() => {
    if (focusNewFieldRef.current && lastAddedFieldRef.current) {
      const timer = setTimeout(() => {
        if (lastAddedFieldRef.current) {
          lastAddedFieldRef.current.focus();
          lastAddedFieldRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        focusNewFieldRef.current = false;
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [form.basicBlock?.fields?.length]);

  // Auto-focus on newly added required doc
  useEffect(() => {
    if (focusNewReqDocRef.current && lastAddedReqDocRef.current) {
      const timer = setTimeout(() => {
        if (lastAddedReqDocRef.current) {
          lastAddedReqDocRef.current.focus();
          lastAddedReqDocRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        focusNewReqDocRef.current = false;
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [form.requiredDocsBlock?.documents?.length]);

  // Auto-focus on newly added additional doc
  useEffect(() => {
    if (focusNewAddDocRef.current && lastAddedAddDocRef.current) {
      const timer = setTimeout(() => {
        if (lastAddedAddDocRef.current) {
          lastAddedAddDocRef.current.focus();
          lastAddedAddDocRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        focusNewAddDocRef.current = false;
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [form.additionalDocsBlock?.documents?.length]);

  const updateFieldItem = (index, key, value) => {
    setForm((prev) => {
      const fields = [...(prev.basicBlock?.fields || [])];
      fields[index] = { ...fields[index], [key]: value };
      return { ...prev, basicBlock: { ...(prev.basicBlock || {}), fields } };
    });
  };

  const addFieldItem = () => {
    const newIndex = form.basicBlock?.fields?.length || 0;
    focusNewFieldRef.current = true;
    setForm((prev) => ({
      ...prev,
      basicBlock: {
        ...(prev.basicBlock || {}),
        fields: [...(prev.basicBlock?.fields || []), { ...emptyField }],
      },
    }));
    setFieldOpenItems((prev) => Array.from(new Set([...prev, `field-${newIndex}`])));
  };

  const removeFieldItem = (index) => {
    setForm((prev) => ({
      ...prev,
      basicBlock: {
        ...(prev.basicBlock || {}),
        fields: (prev.basicBlock?.fields || []).filter((_, i) => i !== index),
      },
    }));
    setFieldOpenItems((prev) => shiftOpenItems(prev, index, 'field'));
  };

  const updateDocItem = (block, index, key, value) => {
    setForm((prev) => {
      const docs = [...(prev[block]?.documents || [])];
      docs[index] = { ...docs[index], [key]: value };
      return { ...prev, [block]: { ...(prev[block] || {}), documents: docs } };
    });
  };

  const addDocItem = (block) => {
    const refMap = {
      requiredDocsBlock: { ref: lastAddedReqDocRef, focus: focusNewReqDocRef, items: reqDocOpenItems, setItems: setReqDocOpenItems, prefix: 'req-doc' },
      additionalDocsBlock: { ref: lastAddedAddDocRef, focus: focusNewAddDocRef, items: addDocOpenItems, setItems: setAddDocOpenItems, prefix: 'add-doc' },
    };
    const config = refMap[block];
    const newIndex = form[block]?.documents?.length || 0;
    config.focus.current = true;
    setForm((prev) => ({
      ...prev,
      [block]: {
        ...(prev[block] || {}),
        documents: [...(prev[block]?.documents || []), { ...emptyDoc }],
      },
    }));
    config.setItems((prev) => Array.from(new Set([...prev, `${config.prefix}-${newIndex}`])));
  };

  const removeDocItem = (block, index) => {
    const prefixMap = {
      requiredDocsBlock: 'req-doc',
      additionalDocsBlock: 'add-doc',
    };
    const setStateMap = {
      requiredDocsBlock: setReqDocOpenItems,
      additionalDocsBlock: setAddDocOpenItems,
    };
    setForm((prev) => ({
      ...prev,
      [block]: {
        ...(prev[block] || {}),
        documents: (prev[block]?.documents || []).filter((_, i) => i !== index),
      },
    }));
    setStateMap[block]((prev) => shiftOpenItems(prev, index, prefixMap[block]));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMsg('');
    try {
      const res = await applyNowContentApi.update(form);
      setApplyNowContent(res.data);
      setMsg('Apply Now fields updated ✓');
      setTimeout(() => setMsg(''), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-sm text-slate-500">Loading apply now content…</div>;
  }

  const fields = form.basicBlock?.fields || [];
  const reqDocs = form.requiredDocsBlock?.documents || [];
  const addDocs = form.additionalDocsBlock?.documents || [];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Apply Now Fields</h1>
          <p className="text-sm text-slate-500">Manage form fields and document requirements.</p>
        </div>
        <Button type="submit" form="apply-now-form" size="sm" disabled={saving}>
          {saving ? 'Saving…' : 'Save Changes'}
        </Button>
      </div>

      {msg && <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{msg}</div>}
      {error && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      <form id="apply-now-form" onSubmit={handleSave} className="space-y-4">
        {/* Basic Details Fields */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Basic Details Fields</CardTitle>
              <CardDescription>Form fields for applicant information.</CardDescription>
            </div>
            <Button type="button" size="sm" variant="outline" onClick={addFieldItem}>Add Field</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {fields.length === 0 ? (
              <div className="py-6 text-center text-sm text-slate-500">No fields yet.</div>
            ) : (
              <Accordion
                type="multiple"
                value={fieldOpenItems}
                onValueChange={setFieldOpenItems}
                className="space-y-2"
              >
                {fields.map((field, i) => {
                  const isLastAdded = i === fields.length - 1;
                  return (
                    <AccordionItem key={`field-${i}`} value={`field-${i}`}>
                      <AccordionTrigger>
                        <span className="text-sm">Field {i + 1}{field.label ? ` · ${field.label}` : ''}</span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid gap-4">
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="space-y-1">
                              <Label>Key</Label>
                              <Input
                                ref={isLastAdded ? lastAddedFieldRef : null}
                                value={field.key}
                                onChange={(e) => updateFieldItem(i, 'key', e.target.value)}
                                placeholder="e.g. fullName"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label>Label</Label>
                              <Input
                                value={field.label}
                                onChange={(e) => updateFieldItem(i, 'label', e.target.value)}
                                placeholder="e.g. Full Name"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label>Placeholder</Label>
                              <Input
                                value={field.placeholder || ''}
                                onChange={(e) => updateFieldItem(i, 'placeholder', e.target.value)}
                                placeholder="e.g. Jane Doe"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label>Type</Label>
                              <select
                                className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:ring-2 focus:ring-slate-900 outline-none"
                                value={field.type || 'text'}
                                onChange={(e) => updateFieldItem(i, 'type', e.target.value)}
                              >
                                <option value="text">Text</option>
                                <option value="email">Email</option>
                                <option value="tel">Phone</option>
                                <option value="textarea">Textarea</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              id={`field-req-${i}`}
                              type="checkbox"
                              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                              checked={Boolean(field.required)}
                              onChange={(e) => updateFieldItem(i, 'required', e.target.checked)}
                            />
                            <Label htmlFor={`field-req-${i}`} className="text-sm cursor-pointer">Required</Label>
                          </div>

                          <Button type="button" size="sm" variant="destructive" onClick={() => removeFieldItem(i)}>
                            Remove Field
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}
          </CardContent>
        </Card>

        {/* Required Documents */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Required Documents</CardTitle>
              <CardDescription>Mandatory document uploads.</CardDescription>
            </div>
            <Button type="button" size="sm" variant="outline" onClick={() => addDocItem('requiredDocsBlock')}>Add Document</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {reqDocs.length === 0 ? (
              <div className="py-6 text-center text-sm text-slate-500">No required documents yet.</div>
            ) : (
              <Accordion
                type="multiple"
                value={reqDocOpenItems}
                onValueChange={setReqDocOpenItems}
                className="space-y-2"
              >
                {reqDocs.map((doc, i) => {
                  const isLastAdded = i === reqDocs.length - 1;
                  return (
                    <AccordionItem key={`req-doc-${i}`} value={`req-doc-${i}`}>
                      <AccordionTrigger>
                        <span className="text-sm">Doc {i + 1}{doc.label ? ` · ${doc.label}` : ''}</span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid gap-4">
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="space-y-1">
                              <Label>Key</Label>
                              <Input
                                ref={isLastAdded ? lastAddedReqDocRef : null}
                                value={doc.key}
                                onChange={(e) => updateDocItem('requiredDocsBlock', i, 'key', e.target.value)}
                                placeholder="e.g. passport"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label>Label</Label>
                              <Input
                                value={doc.label}
                                onChange={(e) => updateDocItem('requiredDocsBlock', i, 'label', e.target.value)}
                                placeholder="e.g. Passport"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              id={`req-doc-check-${i}`}
                              type="checkbox"
                              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                              checked={Boolean(doc.required)}
                              onChange={(e) => updateDocItem('requiredDocsBlock', i, 'required', e.target.checked)}
                            />
                            <Label htmlFor={`req-doc-check-${i}`} className="text-sm cursor-pointer">Required</Label>
                          </div>

                          <Button type="button" size="sm" variant="destructive" onClick={() => removeDocItem('requiredDocsBlock', i)}>
                            Remove Document
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}
          </CardContent>
        </Card>

        {/* Additional Documents */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Additional Documents</CardTitle>
              <CardDescription>Optional document uploads.</CardDescription>
            </div>
            <Button type="button" size="sm" variant="outline" onClick={() => addDocItem('additionalDocsBlock')}>Add Document</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {addDocs.length === 0 ? (
              <div className="py-6 text-center text-sm text-slate-500">No additional documents yet.</div>
            ) : (
              <Accordion
                type="multiple"
                value={addDocOpenItems}
                onValueChange={setAddDocOpenItems}
                className="space-y-2"
              >
                {addDocs.map((doc, i) => {
                  const isLastAdded = i === addDocs.length - 1;
                  return (
                    <AccordionItem key={`add-doc-${i}`} value={`add-doc-${i}`}>
                      <AccordionTrigger>
                        <span className="text-sm">Doc {i + 1}{doc.label ? ` · ${doc.label}` : ''}</span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid gap-4">
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="space-y-1">
                              <Label>Key</Label>
                              <Input
                                ref={isLastAdded ? lastAddedAddDocRef : null}
                                value={doc.key}
                                onChange={(e) => updateDocItem('additionalDocsBlock', i, 'key', e.target.value)}
                                placeholder="e.g. drivingLicence"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label>Label</Label>
                              <Input
                                value={doc.label}
                                onChange={(e) => updateDocItem('additionalDocsBlock', i, 'label', e.target.value)}
                                placeholder="e.g. Driving Licence"
                              />
                            </div>
                          </div>

                          <Button type="button" size="sm" variant="destructive" onClick={() => removeDocItem('additionalDocsBlock', i)}>
                            Remove Document
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

function shiftOpenItems(items, removedIndex, prefix) {
  return items
    .map((value) => {
      if (!value.startsWith(`${prefix}-`)) return value;
      const index = Number(value.slice(prefix.length + 1));
      if (Number.isNaN(index)) return null;
      if (index === removedIndex) return null;
      if (index > removedIndex) return `${prefix}-${index - 1}`;
      return value;
    })
    .filter(Boolean);
}
