$(document).ready(function() {
    const userId = sessionStorage.getItem('userId');
    $('#welcomeMessage').text(`${userId}님의 계좌 목록:`);

    function loadAccounts() {
        $.get(`/api/accounts?user_id=${userId}`, function(data) {
            let accountsHtml = '';
            if (data.accounts && data.accounts.length > 0) {
                data.accounts.forEach(account => {
                    accountsHtml += `
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            ${account.account_number} - ${account.account_balance}
                            <div>
                                <button class=" btn btn-danger btn-sm deleteAccount" data-id="${account.id}">삭제</button>
                                <button class="btn btn-success btn-sm deposit" data-id="${account.id}">입금</button>
                                <button class="btn btn-warning btn-sm withdraw" data-id="${account.id}">출금</button>
                            </div>
                        </li>`;
                });
            } else {
                accountsHtml = '<li class="list-group-item">계좌가 없습니다.</li>';
            }
            $('#accountsList').html(accountsHtml);
        }).fail(function() {
            alert('계좌 목록을 불러오는데 실패했습니다.');
        });
    }

    loadAccounts();

    $('#addAccount').click(function() {
        const accountType = $('#newAccountType').val();
        const accountPassword = $('#newAccountPassword').val();
        $.post('/api/accounts/create', {
            account_type: accountType,
            account_password: accountPassword,
            user_id: userId
        }, function(data) {
            if (data.success) {
                alert('계좌가 추가되었습니다.');
                loadAccounts();
            } else {
                alert('계좌 추가 실패');
            }
        }).fail(function() {
            alert('계좌 추가 요청에 실패했습니다.');
        });
    });

    $(document).on('click', '.deleteAccount', function() {
        const accountId = $(this).data('id');
        $.ajax({
            url: `/api/accounts/delete/${accountId}`,
            type: 'DELETE',
            data: { user_id: userId },
            success: function(data) {
                if (data.success) {
                    alert('계좌가 삭제되었습니다.');
                    loadAccounts();
                } else {
                    alert('계좌 삭제 실패');
                }
            },
            fail: function() {
                alert('계좌 삭제 요청에 실패했습니다.');
            }
        });
    });

    $(document).on('click', '.deposit', function() {
        const accountId = $(this).data('id');
        const amount = prompt('입금할 금액을 입력하세요:');
        $.post('/api/accounts/deposit', {
            account_id: accountId,
            amount: amount,
            user_id: userId
        }, function(data) {
            if (data.success) {
                alert('입금되었습니다.');
                loadAccounts();
            } else {
                alert('입금 실패');
            }
        }).fail(function() {
            alert('입금 요청에 실패했습니다.');
        });
    });

    $(document).on('click', '.withdraw', function() {
        const accountId = $(this).data('id');
        const amount = prompt('출금할 금액을 입력하세요:');
        $.post('/api/accounts/withdraw', {
            account_id: accountId,
            amount: amount,
            user_id: userId
        }, function(data) {
            if (data.success) {
                alert('출금되었습니다.');
                loadAccounts();
            } else {
                alert('출금 실패');
            }
        }).fail(function() {
            alert('출금 요청에 실패했습니다.');
        });
    });
});
