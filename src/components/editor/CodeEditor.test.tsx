import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { EditorView } from '@codemirror/view'
import { undo, redo } from '@codemirror/commands'
import { CodeEditor } from './CodeEditor'
import { FileTabs } from './FileTabs'

describe('CodeEditor', () => {
  it('mounts with value and fires onChange', () => {
    const onChange = vi.fn()
    render(<CodeEditor value="select 1" onChange={onChange} language="sql" />)
    const dom = screen.getByTestId('code-editor').querySelector('.cm-editor') as HTMLElement
    expect(dom).toBeTruthy()
    expect(dom.textContent).toContain('select 1')
    const view = EditorView.findFromDOM(dom)!
    view.dispatch({ changes: { from: 0, insert: 'x' } })
    expect(onChange).toHaveBeenCalledWith('xselect 1')
  })

  it('undo restores previous text, redo reapplies', () => {
    const onChange = vi.fn()
    render(<CodeEditor value="select 1" onChange={onChange} language="sql" />)
    const view = EditorView.findFromDOM(screen.getByTestId('code-editor').querySelector('.cm-editor') as HTMLElement)!
    view.dispatch({ changes: { from: 8, insert: ';' }, userEvent: 'input.type' })
    expect(view.state.doc.toString()).toBe('select 1;')
    expect(undo(view)).toBe(true)
    expect(view.state.doc.toString()).toBe('select 1')
    expect(onChange).toHaveBeenLastCalledWith('select 1')
    expect(redo(view)).toBe(true)
    expect(view.state.doc.toString()).toBe('select 1;')
  })

  it('Mod-Enter calls onRun', () => {
    const onRun = vi.fn()
    render(<CodeEditor value="" onChange={() => {}} language="python" onRun={onRun} />)
    fireEvent.keyDown(screen.getByLabelText('Code'), { key: 'Enter', keyCode: 13, ctrlKey: true })
    expect(onRun).toHaveBeenCalled()
  })
})

describe('FileTabs', () => {
  it('selects a file', () => {
    const onSelect = vi.fn()
    render(<FileTabs files={[{ id: 'a', name: 'a.sql' }, { id: 'b', name: 'b.sql' }]} activeId="a" onSelect={onSelect} />)
    fireEvent.click(screen.getByText('b.sql'))
    expect(onSelect).toHaveBeenCalledWith('b')
  })
})
